const NOTION_API_KEY = process.env.NOTION_API_KEY
const DATABASE_ID = process.env.NOTION_DATABASE_ID

// fallback 测试数据
const fallbackJobs = [
  {
    title: 'Frontend Engineer',
    company: 'Remote Inc',
    region: 'remote',
    role: 'frontend',
    paid: true,
    url: 'https://example.com'
  },
  {
    title: 'Backend Developer',
    company: 'Tech Corp',
    region: 'europe',
    role: 'backend',
    paid: false,
    url: 'https://example.com'
  }
]

export default async function handler(req, res) {
  if (!NOTION_API_KEY || !DATABASE_ID) {
    // 没配置 Notion，返回测试数据
    return res.status(200).json(fallbackJobs)
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
      title: item.properties.Title?.title[0]?.plain_text || 'Untitled',
      company: item.properties.Company?.rich_text[0]?.plain_text || '',
      region: item.properties.Region?.select?.name.toLowerCase() || 'remote',
      role: item.properties.Role?.select?.name.toLowerCase() || 'other',
      paid: item.properties.Paid?.checkbox || false,
      url: item.properties.URL?.url || '#'
    }))

    res.status(200).json(jobs)
  } catch (err) {
    console.error('拉取 Notion 数据失败', err)
    // 出错也返回 fallback
    res.status(200).json(fallbackJobs)
  }
}
