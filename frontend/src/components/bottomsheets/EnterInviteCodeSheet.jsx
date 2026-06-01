import { useState } from 'react'
import BottomSheet from '../common/BottomSheet'

export default function EnterInviteCodeSheet({ isOpen, onClose }) {
  const [code, setCode] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: API 연동
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <h2>초대코드 입력</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="초대코드를 입력하세요"
        />
        <button type="submit">참여하기</button>
      </form>
    </BottomSheet>
  )
}
