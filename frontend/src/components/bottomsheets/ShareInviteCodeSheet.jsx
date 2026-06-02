import { useState } from 'react'
import BottomSheet from '../common/BottomSheet'
import styles from './ShareInviteCodeSheet.module.css'

export default function ShareInviteCodeSheet({ isOpen, inviteCode, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = inviteCode
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'didyou👀 초대코드',
          text: `같이 인증해요! 초대코드: ${inviteCode}`,
        })
      } catch {
        // 사용자가 공유 취소한 경우
      }
    } else {
      handleCopy()
    }
  }

  const chars = inviteCode ? inviteCode.split('') : []

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className={styles.wrap}>
        <div className={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>

        <h2 className={styles.title}>초대 코드</h2>
        <p className={styles.subtitle}>아래 코드를 친구에게 공유해요</p>

        {/* 코드 박스 */}
        <div className={styles.codeWrap}>
          <div className={styles.codeBoxes}>
            {chars.map((ch, i) => (
              <div key={i} className={styles.codeBox}>{ch}</div>
            ))}
          </div>
        </div>

        {/* 버튼들 */}
        <div className={styles.btnGroup}>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                복사완료
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                코드 복사
              </>
            )}
          </button>

          <button className={styles.shareBtn} onClick={handleShare}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            공유하기
          </button>
        </div>

        <button className={styles.doneBtn} onClick={onClose}>
          완료
        </button>
      </div>
    </BottomSheet>
  )
}
