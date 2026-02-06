const NOTION_API_KEY = process.env.NOTION_API_KEY
const DATABASE_ID = process.env.NOTION_DATABASE_ID

export default async function handler(req, res) {
  if (!NOTION_API_KEY || !DATABASE_ID) {
    return res.status(500).json({ error: '未配置 Notion API KEY 或 DATABASE ID' })
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filter: { property: 'Status', select: { equals: 'Published' } },
          sorts: [{ property: 'Paid', direction: 'descending' }]
        })
      }
    )

    const data = await response.json()

    const jobs = data.results.map(item => ({
      title: item.properties.Title.title[0]?.plain_text || '',
      company: item.properties.Company.rich_text[0]?.plain_text || '',
      region: item.properties.Region.select?.name.toLowerCase() || 'remote',
      role: item.properties.Role.select?.name.toLowerCase() || 'other',
      paid: item.properties.Paid.checkbox,
      url: item.properties.URL.url
    }))

    res.status(200).json(jobs)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '拉取 Notion 数据失败' })
  }
}
