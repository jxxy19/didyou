import { useState, useRef } from 'react'
import Cropper from 'react-easy-crop'
import styles from './Profile.module.css'

const CHARACTER_LIST = ['🐰', '🦊', '🐻', '🐱', '🦁', '🐶', '🐷', '🐼']

const MOCK_USER = {
  avatar:   '🐰',
  nickname: '토끼냥',
  email:    'juyoun919@gmail.com',
}

const getSettings = (onEditProfile) => [
  {
    group: '계정',
    items: [
      { icon: '✏️', label: '프로필 수정',  action: onEditProfile },
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

function ImageCropModal({ imageUrl, onConfirm, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleSave = () => {
    if (!croppedAreaPixels) return

    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height)
      canvas.width = size
      canvas.height = size

      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#FAF8FC'
      ctx.fillRect(0, 0, size, size)

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        size,
        size
      )

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        onConfirm(url)
      })
    }
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.cropModal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>사진 조정</h3>

        <div className={styles.cropContainer}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, croppedAreaPixels) => {
              setCroppedAreaPixels(croppedAreaPixels)
            }}
          />
        </div>

        <div className={styles.cropControls}>
          <div className={styles.zoomControl}>
            <span className={styles.zoomLabel}>확대</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className={styles.zoomSlider}
            />
          </div>
        </div>

        <div className={styles.modalBtns}>
          <button className={styles.modalCancel} onClick={onCancel}>취소</button>
          <button className={styles.modalConfirm} onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  )
}

function AvatarDropdown({ currentAvatar, onSelectChar, onUploadPhoto, onDeletePhoto, hasPhoto, onClose, btnRef }) {
  const fileInputRef = useRef(null)
  const [pos, setPos] = useState(null)

  useState(() => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (rect) {
      setPos({
        top: rect.bottom + 16,
        left: rect.left - 120
      })
    }
  })

  return (
    <>
      <div className={styles.avatarDropdownBackdrop} onClick={onClose} />
      {pos && <div className={styles.avatarDropdown} style={{ top: `${pos.top}px`, left: `${pos.left}px` }}>
        <p className={styles.avatarDropdownLabel}>기본 캐릭터</p>
        <div className={styles.avatarCharGrid}>
          {CHARACTER_LIST.map(char => (
            <button
              key={char}
              className={`${styles.avatarChar} ${currentAvatar === char ? styles.avatarCharActive : ''}`}
              onClick={() => { onSelectChar(char); onClose() }}
            >
              {char}
            </button>
          ))}
        </div>

        <div className={styles.avatarDivider} />

        <div className={styles.avatarActionWrap}>
          <button className={styles.avatarAction} onClick={() => fileInputRef.current?.click()}>
            <span>📷</span> 사진 올리기
          </button>
          {hasPhoto && (
            <button className={`${styles.avatarAction} ${styles.avatarActionDanger}`} onClick={onDeletePhoto}>
              <span>🗑️</span> 사진 삭제
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => {
            if (e.target.files?.[0]) {
              onUploadPhoto(e.target.files[0])
              onClose()
            }
          }}
        />
      </div>
      }
    </>
  )
}

function EditProfileModal({ user, onConfirm, onCancel }) {
  const [nickname, setNickname] = useState(user.nickname)

  const handleSave = () => {
    if (nickname.trim()) {
      onConfirm({ nickname })
      setNickname(user.nickname)
    }
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>프로필 수정</h3>

        <div className={styles.editField}>
          <label className={styles.editLabel}>닉네임</label>
          <input
            type="text"
            className={styles.editInput}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
            maxLength={20}
          />
          <span className={styles.editHint}>{nickname.length}/20</span>
        </div>

        <div className={styles.modalBtns}>
          <button className={styles.modalCancel} onClick={onCancel}>취소</button>
          <button
            className={styles.modalConfirm}
            onClick={handleSave}
            disabled={!nickname.trim()}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  )
}

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
  const avatarBtnRef = useRef(null)
  const [user, setUser] = useState(MOCK_USER)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState(null)
  const [cropImageUrl, setCropImageUrl] = useState(null)

  const handleEditProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
    setShowEditProfile(false)
  }

  const handleSelectChar = (char) => {
    setUser(prev => ({ ...prev, avatar: char }))
    setUploadedPhotoUrl(null)
  }

  const handleUploadPhoto = (file) => {
    const url = URL.createObjectURL(file)
    setCropImageUrl(url)
  }

  const handleCropConfirm = (croppedUrl) => {
    setUploadedPhotoUrl(croppedUrl)
    setCropImageUrl(null)
    setShowAvatarDropdown(false)
  }

  const handleDeletePhoto = () => {
    if (uploadedPhotoUrl) {
      URL.revokeObjectURL(uploadedPhotoUrl)
    }
    setUploadedPhotoUrl(null)
  }

  const displayAvatar = uploadedPhotoUrl || user.avatar

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>프로필</h1>
      </header>

      <div className={styles.main}>
        {/* 프로필 카드 */}
        <div className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {uploadedPhotoUrl ? (
                <img src={uploadedPhotoUrl} alt="프로필" className={styles.avatarImg} />
              ) : (
                displayAvatar
              )}
            </div>
            <button
              ref={avatarBtnRef}
              className={styles.avatarEditBtn}
              onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
              aria-label="프로필 사진 변경"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>

          {showAvatarDropdown && (
            <AvatarDropdown
              currentAvatar={user.avatar}
              onSelectChar={handleSelectChar}
              onUploadPhoto={handleUploadPhoto}
              onDeletePhoto={handleDeletePhoto}
              hasPhoto={!!uploadedPhotoUrl}
              onClose={() => setShowAvatarDropdown(false)}
              btnRef={avatarBtnRef}
            />
          )}
          <p className={styles.nickname}>{user.nickname}</p>
          <p className={styles.email}>{user.email}</p>
        </div>

        {/* 설정 목록 */}
        {getSettings(() => setShowEditProfile(true)).map(group => (
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

      {cropImageUrl && (
        <ImageCropModal
          imageUrl={cropImageUrl}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropImageUrl(null)}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          user={user}
          onConfirm={handleEditProfile}
          onCancel={() => setShowEditProfile(false)}
        />
      )}

      {showLogout && (
        <LogoutModal
          onConfirm={() => setShowLogout(false)}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  )
}
