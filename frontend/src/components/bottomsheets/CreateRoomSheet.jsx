import { useState } from 'react'
import BottomSheet from '../common/BottomSheet'
import ShareInviteCodeSheet from './ShareInviteCodeSheet'
import styles from './CreateRoomSheet.module.css'

const COLORS = ['#F06292', '#BA68C8', '#4FC3F7', '#FFD54F', '#FF8A65', '#4DB6AC']

function StepIndicator({ current }) {
  return (
    <div className={styles.stepIndicator}>
      {[1, 2].map(n => (
        <span key={n} className={`${styles.stepDot} ${n <= current ? styles.stepDotActive : ''}`} />
      ))}
    </div>
  )
}

function Step1({ roomName, setRoomName, onNext, onClose }) {
  const canNext = roomName.trim().length > 0

  return (
    <div className={styles.stepWrap}>
      <div className={styles.sheetHeader}>
        <div>
          <p className={styles.stepLabel}>방 만들기 · 1/2</p>
          <h2 className={styles.sheetTitle}>방 이름을 정해보세요</h2>
        </div>
        <StepIndicator current={1} />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="roomName">방 이름</label>
        <input
          id="roomName"
          className={styles.input}
          type="text"
          placeholder="예) 아침 운동 챌린지 🏃"
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
          maxLength={20}
          autoFocus
        />
        <span className={styles.inputCount}>{roomName.length}/20</span>
      </div>

      <button
        className={`${styles.primaryBtn} ${!canNext ? styles.primaryBtnDisabled : ''}`}
        onClick={onNext}
        disabled={!canNext}
      >
        다음
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  )
}

function Step2({ categories, catInput, setCatInput, catColor, setCatColor, onAdd, onRemove, onBack, onCreate }) {
  const canAdd    = catInput.trim().length > 0
  const canCreate = categories.length > 0

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && canAdd) onAdd()
  }

  return (
    <div className={styles.stepWrap}>
      <div className={styles.sheetHeader}>
        <div>
          <p className={styles.stepLabel}>방 만들기 · 2/2</p>
          <h2 className={styles.sheetTitle}>카테고리를 추가해요</h2>
        </div>
        <StepIndicator current={2} />
      </div>

      <p className={styles.subtitle}>
        무엇을 인증할지 정해보세요. 최소 1개 필요해요.
      </p>

      {/* 추가된 카테고리 목록 */}
      {categories.length > 0 && (
        <div className={styles.catList}>
          {categories.map(cat => (
            <div key={cat.id} className={styles.catItem}>
              <span className={styles.catDot} style={{ background: cat.color }} />
              <span className={styles.catName}>{cat.name}</span>
              <button
                className={styles.catRemove}
                onClick={() => onRemove(cat.id)}
                aria-label="삭제"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 새 카테고리 입력 폼 */}
      <div className={styles.addForm}>
        <div className={styles.addInputRow}>
          <input
            className={styles.addInput}
            type="text"
            placeholder="카테고리 이름 입력"
            value={catInput}
            onChange={e => setCatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={15}
          />
          <button
            className={`${styles.addBtn} ${!canAdd ? styles.addBtnDisabled : ''}`}
            onClick={onAdd}
            disabled={!canAdd}
            aria-label="추가"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div className={styles.colorRow}>
          {COLORS.map(c => (
            <button
              key={c}
              className={`${styles.colorSwatch} ${catColor === c ? styles.colorSwatchActive : ''}`}
              style={{ background: c }}
              onClick={() => setCatColor(c)}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={styles.btnRow}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          이전
        </button>
        <button
          className={`${styles.primaryBtn} ${styles.primaryBtnGrow} ${!canCreate ? styles.primaryBtnDisabled : ''}`}
          onClick={onCreate}
          disabled={!canCreate}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          방 만들기
        </button>
      </div>
    </div>
  )
}

export default function CreateRoomSheet({ isOpen, onClose }) {
  const [step, setStep]           = useState(1)
  const [roomName, setRoomName]   = useState('')
  const [categories, setCategories] = useState([])
  const [catInput, setCatInput]   = useState('')
  const [catColor, setCatColor]   = useState(COLORS[0])
  const [inviteCode, setInviteCode] = useState(null)

  const reset = () => {
    setStep(1)
    setRoomName('')
    setCategories([])
    setCatInput('')
    setCatColor(COLORS[0])
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const addCategory = () => {
    const name = catInput.trim()
    if (!name) return
    setCategories(prev => [...prev, { id: Date.now().toString(), name, color: catColor }])
    setCatInput('')
  }

  const removeCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const handleCreate = () => {
    // TODO: API 연동 — { roomName, categories }
    setInviteCode('ABC123')
  }

  const handleShareClose = () => {
    setInviteCode(null)
    handleClose()
  }

  return (
    <>
      <BottomSheet isOpen={isOpen && !inviteCode} onClose={handleClose}>
        {step === 1 && (
          <Step1
            roomName={roomName}
            setRoomName={setRoomName}
            onNext={() => setStep(2)}
            onClose={handleClose}
          />
        )}
        {step === 2 && (
          <Step2
            categories={categories}
            catInput={catInput}
            setCatInput={setCatInput}
            catColor={catColor}
            setCatColor={setCatColor}
            onAdd={addCategory}
            onRemove={removeCategory}
            onBack={() => setStep(1)}
            onCreate={handleCreate}
          />
        )}
      </BottomSheet>

      <ShareInviteCodeSheet
        isOpen={!!inviteCode}
        inviteCode={inviteCode}
        onClose={handleShareClose}
      />
    </>
  )
}
