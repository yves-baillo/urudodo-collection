const IMGBB_API_KEY = '76c918596521fb826dd2933c5f832a42'

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status}`)
  }

  const data = await res.json()
  return data.data.url
}