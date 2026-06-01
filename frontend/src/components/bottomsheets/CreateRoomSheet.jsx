import { useState } from 'react'
import BottomSheet from '../common/BottomSheet'
import ShareInviteCodeSheet from './ShareInviteCodeSheet'

export default function CreateRoomSheet({ isOpen, onClose }) {
  const [inviteCode, setInviteCode] = useState(null)

  function handleCreate() {
    // TODO: API 연동
    setInviteCode('ABC123')
  }

  function handleShareClose() {
    setInviteCode(null)
    onClose()
  }

  return (
    <>
      <BottomSheet isOpen={isOpen && !inviteCode} onClose={onClose}>
        <h2>방 만들기</h2>
        <button onClick={handleCreate}>만들기</button>
      </BottomSheet>

      <ShareInviteCodeSheet
        isOpen={!!inviteCode}
        inviteCode={inviteCode}
        onClose={handleShareClose}
      />
    </>
  )
}
