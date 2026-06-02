import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styles from './CategoryCreate.module.css'

const COLOR_PALETTE = [
  { id: 'pink',     value: '#F06292', label: '핑크' },
  { id: 'lavender', value: '#BA68C8', label: '라벤더' },
  { id: 'sky',      value: '#4FC3F7', label: '스카이' },
  { id: 'yellow',   value: '#FFD54F', label: '옐로우' },
  { id: 'peach',    value: '#FF8A65', label: '피치' },
  { id: 'mint',     value: '#4DB6AC', label: '민트' },
  { id: 'blue',     value: '#5C6BC0', label: '블루' },
  { id: 'rose',     value: '#E57373', label: '로즈' },
]

export default function CategoryCreate() {
  const { roomId } = useParams()
  const navigate   = useNavigate()
  const location   = useLocation()

  const editCategory = location.state?.editCategory ?? null
  const isEdit = !!editCategory

  const [name, setName]   = useState(editCategory?.name ?? '')
  const [color, setColor] = useState(editCategory?.color ?? COLOR_PALETTE[0].value)

  const canSubmit = name.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    // TODO: API 연동 — isEdit ? update : create
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
        <span className={styles.headerTitle}>{isEdit ? '카테고리 수정' : '카테고리 추가'}</span>
        <button
          className={`${styles.iconBtn} ${styles.submitIconBtn} ${!canSubmit ? styles.submitIconBtnDisabled : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="추가"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </header>

      <main className={styles.main}>
        {/* 미리보기 */}
        <div className={styles.preview}>
          <div className={styles.previewRow}>
            <span className={styles.previewDot} style={{ background: color }} />
            <span className={styles.previewName}>
              {name.trim() || '카테고리 이름'}
            </span>
          </div>
          <p className={styles.previewHint}>이렇게 보여요</p>
        </div>

        {/* 이름 입력 */}
        <section className={styles.section}>
          <label className={styles.sectionLabel} htmlFor="catName">
            카테고리 이름
            <span className={styles.required}>필수</span>
          </label>
          <input
            id="catName"
            className={styles.input}
            type="text"
            placeholder="예) 운동, 독서, 물 마시기"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <span className={styles.inputCount}>{name.length}/20</span>
        </section>

        {/* 색상 선택 */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>색상 선택</p>
          <div className={styles.colorGrid}>
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.id}
                className={`${styles.colorBtn} ${color === c.value ? styles.colorBtnActive : ''}`}
                onClick={() => setColor(c.value)}
                aria-label={c.label}
              >
                <span className={styles.colorCircle} style={{ background: c.value }} />
                {color === c.value && (
                  <svg className={styles.colorCheck} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                <span className={styles.colorLabel}>{c.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 추가 버튼 */}
        <button
          className={`${styles.submitBtn} ${!canSubmit ? styles.submitBtnDisabled : ''}`}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {isEdit ? '수정하기' : '카테고리 추가하기'}
        </button>
      </main>
    </div>
  )
}
