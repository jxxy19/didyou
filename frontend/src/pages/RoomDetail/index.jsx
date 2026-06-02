import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomNav from '../../components/common/BottomNav'
import styles from './RoomDetail.module.css'

const MOCK_ROOM = {
  id: '1',
  name: '아침 운동 챌린지 🏃',
  memberCount: 5,
  isOwner: true,
  members: [
    { id: 'm1', avatar: '🐱', nickname: '초코캣' },
    { id: 'm2', avatar: '🐰', nickname: '토끼냥' },
    { id: 'm3', avatar: '🦊', nickname: '여우나그네' },
    { id: 'm4', avatar: '🐻', nickname: '곰돌이' },
    { id: 'm5', avatar: '🐢', nickname: '거북이' },
  ],
  categories: [
    { id: 'exercise',   name: '운동',     color: '#F06292', verifiedCount: 4 },
    { id: 'diet',       name: '건강식',   color: '#BA68C8', verifiedCount: 2 },
    { id: 'stretch',    name: '스트레칭', color: '#4FC3F7', verifiedCount: 5 },
    { id: 'meditation', name: '명상',     color: '#FFD54F', verifiedCount: 0 },
    { id: 'water',      name: '수분',     color: '#FF8A65', verifiedCount: 3 },
  ],
}

/* ─── 배지 ───────────────────────────────── */
function CategoryBadge({ verified, total }) {
  if (verified === total)
    return <span className={`${styles.catBadge} ${styles.badgeAll}`}>완료 ✅</span>
  if (verified === 0)
    return <span className={`${styles.catBadge} ${styles.badgeNone}`}>미인증</span>
  return <span className={`${styles.catBadge} ${styles.badgePartial}`}>{verified}/{total}명</span>
}

/* ─── 설정 드롭다운 ──────────────────────── */
function SettingsMenu({ isOwner, onClose, onLeave, onDelete }) {
  return (
    <>
      <div className={styles.menuBackdrop} onClick={onClose} />
      <div className={styles.menu}>
        <button className={styles.menuItem} onClick={onClose}>
          <span className={styles.menuIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
          초대 코드
        </button>
        <button className={styles.menuItem} onClick={onClose}>
          <span className={styles.menuIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          참여 멤버
        </button>
        <div className={styles.menuDivider} />
        <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => { onClose(); onLeave() }}>
          <span className={styles.menuIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          방 나가기
        </button>
        {isOwner && (
          <button className={`${styles.menuItem} ${styles.menuItemDelete}`} onClick={() => { onClose(); onDelete() }}>
            <span className={styles.menuIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" /><path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </span>
            방 삭제하기
          </button>
        )}
      </div>
    </>
  )
}

/* ─── 방 나가기 / 삭제 확인 모달 ────────── */
function RoomActionModal({ type, roomName, onConfirm, onCancel }) {
  const isDelete = type === 'delete'
  return (
    <div className={styles.confirmOverlay} onClick={onCancel}>
      <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
        <div className={styles.confirmIconWrap} style={isDelete ? {} : { background: '#FFF3E0', color: '#F57C00' }}>
          {isDelete ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          )}
        </div>
        <h3 className={styles.confirmTitle}>{isDelete ? '방을 삭제할까요?' : '방을 나갈까요?'}</h3>
        <p className={styles.confirmDesc}>
          {isDelete
            ? <>모든 인증 기록이 사라지고<br />되돌릴 수 없어요</>
            : <>나가면 다시 초대코드로만<br />참여할 수 있어요</>
          }
        </p>
        <div className={styles.confirmBtns}>
          <button className={styles.confirmCancel} onClick={onCancel}>취소</button>
          <button
            className={styles.confirmDelete}
            style={isDelete ? {} : { background: '#F57C00', boxShadow: '0 4px 12px rgba(245,124,0,0.35)' }}
            onClick={onConfirm}
          >
            {isDelete ? '삭제하기' : '나가기'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── 카테고리 메뉴 ──────────────────────── */
function CatMenu({ cat, isLast, onEdit, onDeleteRequest, onClose }) {
  return (
    <>
      <div className={styles.catMenuBackdrop} onClick={onClose} />
      <div className={styles.catMenu}>
        <button
          className={styles.catMenuItem}
          onClick={() => { onClose(); onEdit(cat) }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          수정
        </button>
        <button
          className={`${styles.catMenuItem} ${isLast ? styles.catMenuItemDisabled : styles.catMenuItemDanger}`}
          disabled={isLast}
          onClick={() => { if (!isLast) { onClose(); onDeleteRequest(cat) } }}
          title={isLast ? '최소 1개의 카테고리가 필요해요' : ''}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          삭제
          {isLast && <span className={styles.catMenuDisabledHint}>최소 1개</span>}
        </button>
      </div>
    </>
  )
}

/* ─── 삭제 확인 모달 ─────────────────────── */
function DeleteCatModal({ cat, onConfirm, onCancel }) {
  return (
    <div className={styles.confirmOverlay} onClick={onCancel}>
      <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
        <div className={styles.confirmIconWrap}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h3 className={styles.confirmTitle}>카테고리를 삭제할까요?</h3>
        <p className={styles.confirmDesc}>
          <span className={styles.confirmCatName} style={{ color: cat.color }}>● {cat.name}</span>
          {' '}과 관련된 인증 기록도 모두 사라져요
        </p>
        <div className={styles.confirmBtns}>
          <button className={styles.confirmCancel} onClick={onCancel}>취소</button>
          <button className={styles.confirmDelete} onClick={onConfirm}>삭제하기</button>
        </div>
      </div>
    </div>
  )
}

/* ─── 메인 ───────────────────────────────── */
export default function RoomDetail() {
  const { roomId }   = useParams()
  const navigate     = useNavigate()
  const room         = MOCK_ROOM

  const [settingsOpen, setSettingsOpen]   = useState(false)
  const [openCatMenuId, setOpenCatMenuId] = useState(null)
  const [deleteTarget, setDeleteTarget]   = useState(null)
  const [categories, setCategories]       = useState(room.categories)
  const [roomModal, setRoomModal]         = useState(null) // 'leave' | 'delete' | null

  const total    = room.memberCount * categories.length
  const verified = categories.reduce((sum, c) => sum + c.verifiedCount, 0)
  const pct      = total > 0 ? Math.round((verified / total) * 100) : 0

  const roomState = { roomId: room.id, roomName: room.name, roomCategories: categories }

  const goToFeed   = (cat) => navigate(`/feed/${cat.id}`, { state: roomState })
  const goToUpload = () =>
    navigate('/upload', { state: { ...roomState, preselectedIds: [categories[0]?.id] } })

  const handleCatEdit = (cat) => {
    navigate(`/room/${room.id}/category/new`, { state: { editCategory: cat } })
  }

  const handleCatDeleteRequest = (cat) => setDeleteTarget(cat)

  const handleCatDeleteConfirm = () => {
    setCategories(prev => prev.filter(c => c.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.iconBtn} onClick={() => navigate(-1)} aria-label="뒤로">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className={styles.headerTitle}>{room.name}</span>

        <div className={styles.settingsWrap}>
          <button
            className={`${styles.iconBtn} ${settingsOpen ? styles.iconBtnActive : ''}`}
            onClick={() => setSettingsOpen(o => !o)}
            aria-label="설정"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
          {settingsOpen && (
            <SettingsMenu
              isOwner={room.isOwner}
              onClose={() => setSettingsOpen(false)}
              onLeave={() => setRoomModal('leave')}
              onDelete={() => setRoomModal('delete')}
            />
          )}
        </div>
      </header>

      <div className={styles.main}>
        {/* 멤버 */}
        <section className={styles.memberSection}>
          <div className={styles.memberRow}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{room.memberCount}명 참여 중</span>
          </div>
          <div className={styles.memberList}>
            {room.members.map(m => (
              <div key={m.id} className={styles.memberItem}>
                <div className={styles.memberAvatar}>{m.avatar}</div>
                <span className={styles.memberNick}>{m.nickname}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 오늘 인증 현황 */}
        <section>
          <p className={styles.sectionLabel}>오늘 인증 현황</p>
          <div className={styles.todayCard}>
            <div className={styles.progressHeader}>
              <span className={styles.progressTitle}>전체 인증</span>
              <span className={styles.progressPct}>{pct}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.progressStats}>
              <span>완료 {verified}개</span>
              <span className={styles.statDot}>·</span>
              <span>미인증 {total - verified}개</span>
            </div>
          </div>
        </section>

        {/* 카테고리 목록 */}
        <section>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>카테고리</p>
            <button
              className={styles.addCatBtn}
              onClick={() => navigate(`/room/${room.id}/category/new`)}
              aria-label="카테고리 추가"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              추가
            </button>
          </div>

          <div className={styles.catList}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={styles.catRow}
                onClick={() => goToFeed(cat)}
              >
                <div className={styles.catLeft}>
                  <span className={styles.colorDot} style={{ background: cat.color }} />
                  <span className={styles.catName}>{cat.name}</span>
                </div>
                <div className={styles.catRight}>
                  <span className={styles.catCount}>{cat.verifiedCount}/{room.memberCount}명</span>
                  <CategoryBadge verified={cat.verifiedCount} total={room.memberCount} />

                  {/* ⋮ 버튼 */}
                  <div
                    className={styles.catMenuWrap}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className={`${styles.catMenuBtn} ${openCatMenuId === cat.id ? styles.catMenuBtnActive : ''}`}
                      onClick={() => setOpenCatMenuId(id => id === cat.id ? null : cat.id)}
                      aria-label="카테고리 옵션"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5"  r="1.4" />
                        <circle cx="12" cy="12" r="1.4" />
                        <circle cx="12" cy="19" r="1.4" />
                      </svg>
                    </button>

                    {openCatMenuId === cat.id && (
                      <CatMenu
                        cat={cat}
                        isLast={categories.length === 1}
                        onEdit={handleCatEdit}
                        onDeleteRequest={handleCatDeleteRequest}
                        onClose={() => setOpenCatMenuId(null)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 인증하기 */}
      <div className={styles.certifyBar}>
        <button className={styles.certifyBtn} onClick={goToUpload}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          인증하기
        </button>
      </div>

      <BottomNav />

      {/* 카테고리 삭제 확인 */}
      {deleteTarget && (
        <DeleteCatModal
          cat={deleteTarget}
          onConfirm={handleCatDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* 방 나가기 / 삭제 확인 */}
      {roomModal && (
        <RoomActionModal
          type={roomModal}
          roomName={room.name}
          onConfirm={() => {
            // TODO: API 연동
            setRoomModal(null)
            navigate('/')
          }}
          onCancel={() => setRoomModal(null)}
        />
      )}
    </div>
  )
}
