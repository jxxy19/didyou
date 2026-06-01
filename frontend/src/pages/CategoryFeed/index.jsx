import { useParams } from 'react-router-dom'

export default function CategoryFeed() {
  const { category } = useParams()

  return (
    <div>
      <h1>카테고리 피드</h1>
      <p>category: {category}</p>
    </div>
  )
}
