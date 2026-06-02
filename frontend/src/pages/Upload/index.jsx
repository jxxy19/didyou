import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Upload.module.css'

function PhotoOptionsSheet({ onGallery, onCamera, onClose }) {
  return (
    <div className={styles.sheetOverlay} onClick={onClose}>
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.sheetHandle} />
        <p className={styles.sheetTitle}>사진 추가하기</p>
        <button className={styles.sheetItem} onClick={onGallery}>
          <span className={styles.sheetIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </span>
          갤러리에서 선택
        </button>
        <button className={styles.sheetItem} onClick={onCamera}>
          <span className={styles.sheetIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
          직접 찍기
        </button>
        <button className={`${styles.sheetItem} ${styles.sheetCancel}`} onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  )
}

export default function Upload() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const galleryRef = useRef(null)
  const cameraRef  = useRef(null)

  const {
    roomName       = null,
    roomCategories = null,
    preselectedIds = [],
  } = location.state ?? {}

  const [photo, setPhoto]         = useState(null)
  const [memo, setMemo]           = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedCats, setSelectedCats] = useState(new Set(preselectedIds))

  const handleFile = (file) => {
    if (!file) return
    if (photo) URL.revokeObjectURL(photo.url)
    const url  = URL.createObjectURL(file)
    const now  = new Date()
    const time = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })
    setPhoto({ url, timestamp: time })
    setSheetOpen(false)
  }

  const removePhoto = () => {
    URL.revokeObjectURL(photo.url)
    setPhoto(null)
  }

  const openGallery = () => {
    setSheetOpen(false)
    setTimeout(() => galleryRef.current?.click(), 50)
  }

  const openCamera = () => {
    setSheetOpen(false)
    setTimeout(() => cameraRef.current?.click(), 50)
  }

  const toggleCat = (id) => {
    setSelectedCats(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const hasCategoryRequired = roomCategories ? selectedCats.size > 0 : true
  const canSubmit = !!photo && hasCategoryRequired

  const handleSubmit = () => {
    // TODO: API 연동
    navigate(-1)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.iconBtn} onClick={() => navigate(-1)} aria-label="닫기">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.headerTitle}>인증 올리기</span>
          {roomName && <span className={styles.headerRoom}>{roomName}</span>}
        </div>
        {/* TODO: ✓ 헤더 버튼 vs 하단 올리기 버튼 디자인 결정 필요 (#1) */}
        <button
          className={`${styles.iconBtn} ${styles.submitIconBtn} ${!canSubmit ? styles.submitIconBtnDisabled : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="올리기"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </header>

      <div className={styles.main}>
        {/* 사진 영역 */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>인증 사진</p>

          {photo ? (
            <div className={styles.previewWrap}>
              <img src={photo.url} alt="인증 사진 미리보기" className={styles.previewImg} />
              <button className={styles.removeBtn} onClick={removePhoto} aria-label="사진 제거">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <button className={styles.changeBtn} onClick={() => setSheetOpen(true)}>
                사진 변경
              </button>
            </div>
          ) : (
            <button className={styles.photoPlaceholder} onClick={() => setSheetOpen(true)}>
              <div className={styles.placeholderIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <span className={styles.placeholderText}>사진을 추가해요</span>
              <span className={styles.placeholderHint}>탭해서 갤러리 또는 카메라 선택</span>
            </button>
          )}

          {photo && (
            <div className={styles.timestampChip}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {photo.timestamp} 인증
            </div>
          )}
        </section>

        {/* 카테고리 선택 */}
        {roomCategories && (
          <section className={styles.section}>
            <p className={styles.sectionLabel}>
              카테고리
              <span className={styles.required}>필수</span>
              <span className={styles.catHint}>중복 선택 가능</span>
            </p>
            <div className={styles.catChips}>
              {roomCategories.map((cat) => {
                const active = selectedCats.has(cat.id)
                return (
                  <button
                    key={cat.id}
                    className={`${styles.catChip} ${active ? styles.catChipActive : ''}`}
                    style={active ? {} : { '--dot': cat.color }}
                    onClick={() => toggleCat(cat.id)}
                  >
                    <span
                      className={styles.catDot}
                      style={{ background: active ? 'rgba(255,255,255,0.85)' : cat.color }}
                    />
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* 메모 */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>
            메모
            <span className={styles.optional}>선택</span>
          </p>
          <textarea
            className={styles.memo}
            placeholder="오늘 어떠셨나요? 간단히 기록해보세요 :)"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            maxLength={200}
            rows={4}
          />
          <span className={styles.memoCount}>{memo.length}/200</span>
        </section>

        {/* 올리기 버튼 */}
        <button
          className={`${styles.submitBtn} ${!canSubmit ? styles.submitBtnDisabled : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          올리기
        </button>
      </div>

      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
        onClick={e => { e.target.value = '' }}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
        onClick={e => { e.target.value = '' }}
      />

      {sheetOpen && (
        <PhotoOptionsSheet
          onGallery={openGallery}
          onCamera={openCamera}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  )
}
