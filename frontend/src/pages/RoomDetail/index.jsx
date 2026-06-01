import { useParams } from 'react-router-dom'

export default function RoomDetail() {
  const { roomId } = useParams()

  return (
    <div>
      <h1>방 상세</h1>
      <p>roomId: {roomId}</p>
    </div>
  )
}
