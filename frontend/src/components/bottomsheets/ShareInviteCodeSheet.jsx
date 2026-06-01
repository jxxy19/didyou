import BottomSheet from '../common/BottomSheet'

export default function ShareInviteCodeSheet({ isOpen, inviteCode, onClose }) {
  function handleCopy() {
    navigator.clipboard.writeText(inviteCode)
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <h2>초대코드 공유</h2>
      <p>{inviteCode}</p>
      <button onClick={handleCopy}>코드 복사</button>
      <button onClick={onClose}>완료</button>
    </BottomSheet>
  )
}
