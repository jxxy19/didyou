import { useRef, useState } from 'react'
import BottomSheet from '../common/BottomSheet'
import styles from './EnterInviteCodeSheet.module.css'

const LENGTH = 6

function OTPInput({ code, onChange }) {
  const refs = useRef([])

  const handleChange = (i, e) => {
    const char = e.target.value.slice(-1).toUpperCase().replace(/[^A-Z0-9]/g, '')
    const next = [...code]
    next[i] = char
    onChange(next)
    if (char && i < LENGTH - 1) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      if (!code[i] && i > 0) {
        const next = [...code]
        next[i - 1] = ''
        onChange(next)
        refs.current[i - 1]?.focus()
      } else {
        const next = [...code]
        next[i] = ''
        onChange(next)
      }
    }
    // 채워진 박스에서 방향키로 이동
    if (e.key === 'ArrowRight' && i < LENGTH - 1) refs.current[i + 1]?.focus()
    if (e.key === 'ArrowLeft'  && i > 0)          refs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^A-Z0-9]/gi, '')
      .toUpperCase()
      .slice(0, LENGTH)
    const next = Array(LENGTH).fill('')
    pasted.split('').forEach((c, i) => { next[i] = c })
    onChange(next)
    const focusIdx = Math.min(pasted.length, LENGTH - 1)
    refs.current[focusIdx]?.focus()
  }

  return (
    <div className={styles.otpRow}>
      {Array.from({ length: LENGTH }, (_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          className={`${styles.otpBox} ${code[i] ? styles.otpBoxFilled : ''}`}
          type="text"
          inputMode="text"
          autoCapitalize="characters"
          value={code[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
        />
      ))}
    </div>
  )
}

export default function EnterInviteCodeSheet({ isOpen, onClose }) {
  const [code, setCode] = useState(Array(LENGTH).fill(''))

  const canJoin = code.every(c => c !== '')

  const handleJoin = () => {
    // TODO: API 연동 — code.join('')
    onClose()
  }

  const handleClose = () => {
    setCode(Array(LENGTH).fill(''))
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <div className={styles.wrap}>
        <div className={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        </div>

        <h2 className={styles.title}>초대코드 입력</h2>
        <p className={styles.subtitle}>친구에게 받은 6자리 코드를 입력해요</p>

        <OTPInput code={code} onChange={setCode} />
        <p className={styles.otpHint}>영문 + 숫자 조합 6자리</p>

        <button
          className={`${styles.joinBtn} ${!canJoin ? styles.joinBtnDisabled : ''}`}
          onClick={handleJoin}
          disabled={!canJoin}
        >
          참여하기
        </button>
      </div>
    </BottomSheet>
  )
}
