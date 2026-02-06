export default async function handler(req, res) {
  // 👉 临时兜底数据（用于确认前端没问题）
  const fallbackJobs = [
    {
      title: 'Frontend Engineer',
      company: 'Remote Inc',
      region: 'remote',
      role: 'frontend',
      paid: true,
      url: 'https://example.com'
    }
  ]

  try {
    // 如果你还没配 Notion，先直接返回兜底数据
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      return res.status(200).json(fallbackJobs)
    }

    // 你之后再把 Notion 逻辑加回来
    return res.status(200).json(fallbackJobs)

  } catch (err) {
    console.error(err)
    return res.status(200).json(fallbackJobs)
  }
}
