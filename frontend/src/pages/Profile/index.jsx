import { useState } from 'react'
import styles from './Profile.module.css'

const MOCK_USER = {
  avatar:   '🐰',
  nickname: '토끼냥',
  email:    'juyoun919@gmail.com',
}

const SETTINGS = [
  {
    group: '계정',
    items: [
      { icon: '✏️', label: '프로필 수정',  action: () => {} },
      { icon: '🔔', label: '알림 설정',    action: () => {} },
    ],
  },
  {
    group: '앱',
    items: [
      { icon: 'ℹ️', label: '앱 정보',      action: () => {} },
      { icon: '💬', label: '문의하기',     action: () => {} },
    ],
  },
  {
    group: '기타',
    items: [
      { icon: '🚪', label: '로그아웃',  action: () => {}, danger: true },
    ],
  },
]

function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalIcon}>🚪</div>
        <h3 className={styles.modalTitle}>로그아웃 할까요?</h3>
        <p className={styles.modalDesc}>언제든 다시 로그인할 수 있어요</p>
        <div className={styles.modalBtns}>
          <button className={styles.modalCancel} onClick={onCancel}>취소</button>
          <button className={styles.modalConfirm} onClick={onConfirm}>로그아웃</button>
        </div>
      </div>
    </div>
  )
}

export default function Profile() {
  const user = MOCK_USER
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>프로필</h1>
      </header>

      <div className={styles.main}>
        {/* 프로필 카드 */}
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>{user.avatar}</div>
            <button className={styles.avatarEditBtn} aria-label="프로필 사진 변경">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          <p className={styles.nickname}>{user.nickname}</p>
          <p className={styles.email}>{user.email}</p>
        </div>

        {/* 설정 목록 */}
        {SETTINGS.map(group => (
          <section key={group.group} className={styles.settingGroup}>
            <p className={styles.groupLabel}>{group.group}</p>
            <div className={styles.settingList}>
              {group.items.map(item => (
                <button
                  key={item.label}
                  className={`${styles.settingItem} ${item.danger ? styles.settingItemDanger : ''}`}
                  onClick={item.label === '로그아웃' ? () => setShowLogout(true) : item.action}
                >
                  <span className={styles.settingIcon}>{item.icon}</span>
                  <span className={styles.settingLabel}>{item.label}</span>
                  {!item.danger && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', color: '#C4B5C8' }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}

        <p className={styles.version}>didyou👀 v1.0.0</p>
      </div>

      {showLogout && (
        <LogoutModal
          onConfirm={() => setShowLogout(false)}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  )
}
