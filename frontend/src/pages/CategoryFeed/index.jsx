import { useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import styles from './CategoryFeed.module.css'

const CATEGORY_NAMES = {
  exercise:   '운동',
  diet:       '건강식',
  stretch:    '스트레칭',
  meditation: '명상',
  water:      '수분',
}

const TODAY = new Date()
const todayStr = [
  TODAY.getFullYear(),
  String(TODAY.getMonth() + 1).padStart(2, '0'),
  String(TODAY.getDate()).padStart(2, '0'),
].join('-')

const MY_POST_ID  = 'p1'
const MY_AVATAR   = '🐰'
const MY_NICKNAME = '토끼냥'

const BASE_POSTS = [
  { id: 'p1', avatar: '🐰', nickname: '토끼냥',     relativeTime: '5시간 전', exactTime: '07:32:18', reactions: [{ emoji: '💪', count: 4 }, { emoji: '🔥', count: 2 }], commentCount: 3 },
  { id: 'p2', avatar: '🦊', nickname: '여우나그네', relativeTime: '4시간 전', exactTime: '08:15:03', reactions: [{ emoji: '💪', count: 2 }, { emoji: '👏', count: 1 }], commentCount: 1 },
  { id: 'p3', avatar: '🐻', nickname: '곰돌이',     relativeTime: '3시간 전', exactTime: '08:47:41', reactions: [{ emoji: '🔥', count: 5 }, { emoji: '😍', count: 3 }], commentCount: 5 },
  { id: 'p4', avatar: '🐱', nickname: '냥이집사',   relativeTime: '2시간 전', exactTime: '09:20:07', reactions: [{ emoji: '💪', count: 1 }],                            commentCount: 0 },
]

const POSTS_BY_DATE = {
  '2026-06-02': BASE_POSTS,
  '2026-06-01': BASE_POSTS,
  '2026-05-31': BASE_POSTS.slice(0, 3),
  '2026-05-30': BASE_POSTS.slice(0, 2),
  '2026-05-29': BASE_POSTS.slice(1, 3),
  '2026-05-28': BASE_POSTS.slice(0, 1),
  '2026-05-26': BASE_POSTS.slice(2, 3),
  '2026-05-25': BASE_POSTS.slice(0, 2),
  '2026-05-22': BASE_POSTS.slice(1, 2),
  '2026-05-20': BASE_POSTS.slice(0, 1),
}

const HAS_POSTS = new Set(Object.keys(POSTS_BY_DATE))

const INIT_COMMENTS = {
  p1: [
    { id: 'c1', avatar: '🦊', nickname: '여우나그네', text: '오늘도 파이팅!!! 💪',         time: '오전 7:45' },
    { id: 'c2', avatar: '🐻', nickname: '곰돌이',     text: '대단해요 매일 하시네요 👍',  time: '오전 8:02' },
    { id: 'c3', avatar: '🐢', nickname: '거북이',     text: '저도 오늘 했어요 ㅎㅎ',      time: '오전 8:30' },
  ],
  p2: [
    { id: 'c4', avatar: '🐱', nickname: '냥이집사',   text: '👏👏',                       time: '오전 8:20' },
  ],
  p3: [
    { id: 'c5', avatar: '🐰', nickname: '토끼냥',     text: '완전 멋져요!',               time: '오전 8:50', isMine: true },
    { id: 'c6', avatar: '🦊', nickname: '여우나그네', text: '저도 내일부터 해볼게요',     time: '오전 9:00' },
    { id: 'c7', avatar: '🐢', nickname: '거북이',     text: '응원해요!!',                 time: '오전 9:15' },
    { id: 'c8', avatar: '🐻', nickname: '곰돌이',     text: '화이팅 같이해요 💪',        time: '오전 9:22' },
    { id: 'c9', avatar: '🐱', nickname: '냥이집사',   text: '매일 보니 자극받아요 ㅎ',   time: '오전 9:30' },
  ],
  p4: [],
}

const DOW = ['일', '월', '화', '수', '목', '금', '토']

/* ─── 달력 모달 ─────────────────────────── */
function CalendarModal({ selectedDate, onSelect, onClose }) {
  const init = new Date(selectedDate + 'T00:00:00')
  const [viewYear, setViewYear]   = useState(init.getFullYear())
  const [viewMonth, setViewMonth] = useState(init.getMonth())

  const firstDow    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const goPrev = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) } else setViewMonth(m => m - 1)
  }
  const goNext = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) } else setViewMonth(m => m + 1)
  }

  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  return (
    <div className={styles.calOverlay} onClick={onClose}>
      <div className={styles.calModal} onClick={e => e.stopPropagation()}>
        <div className={styles.calHeader}>
          <button className={styles.calNavBtn} onClick={goPrev} aria-label="이전 달">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <span className={styles.calMonthLabel}>{viewYear}년 {viewMonth + 1}월</span>
          <button className={styles.calNavBtn} onClick={goNext} aria-label="다음 달">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <div className={styles.calDow}>
          {DOW.map(d => <span key={d} className={styles.calDowCell}>{d}</span>)}
        </div>
        <div className={styles.calGrid}>
          {cells.map((day, i) => {
            if (!day) return <span key={`e${i}`} />
            const dateStr    = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isSelected = dateStr === selectedDate
            const isToday    = dateStr === todayStr
            const isFuture   = dateStr > todayStr
            const hasPost    = HAS_POSTS.has(dateStr)
            const disabled   = isFuture || !hasPost
            return (
              <button key={day} disabled={disabled}
                className={[styles.calDay, isSelected && styles.calDaySelected, !isSelected && isToday && styles.calDayToday, disabled && styles.calDayDisabled, !disabled && !isSelected && styles.calDayActive].filter(Boolean).join(' ')}
                onClick={() => { onSelect(dateStr); onClose() }}>
                <span>{day}</span>
                {hasPost && !isFuture && <span className={styles.calDot} />}
              </button>
            )
          })}
        </div>
        <button className={styles.calCloseBtn} onClick={onClose}>닫기</button>
      </div>
    </div>
  )
}

/* ─── 삭제 확인 모달 ─────────────────────── */
function DeleteConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className={styles.confirmOverlay} onClick={onCancel}>
      <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
        <div className={styles.confirmIconWrap}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h3 className={styles.confirmTitle}>인증을 삭제할까요?</h3>
        <p className={styles.confirmDesc}>삭제하면 되돌릴 수 없어요</p>
        <div className={styles.confirmBtns}>
          <button className={styles.confirmCancel} onClick={onCancel}>취소</button>
          <button className={styles.confirmDelete} onClick={onConfirm}>삭제하기</button>
        </div>
      </div>
    </div>
  )
}

/* ─── 댓글 아이템 ────────────────────────── */
function CommentItem({ comment, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos]   = useState({ top: 0, right: 0 })
  const [editing, setEditing]   = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const btnRef = useRef(null)

  const openMenu = () => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (rect) {
      setMenuPos({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
    }
    setMenuOpen(true)
  }

  const saveEdit = () => {
    const trimmed = editText.trim()
    if (!trimmed) return
    onEdit(comment.id, trimmed)
    setEditing(false)
  }

  const cancelEdit = () => {
    setEditText(comment.text)
    setEditing(false)
  }

  return (
    <div className={styles.cmtItem}>
      <div className={styles.cmtAvatar}>{comment.avatar}</div>
      <div className={styles.cmtBody}>
        <div className={styles.cmtMeta}>
          <span className={styles.cmtNick}>{comment.nickname}</span>
          <span className={styles.cmtTime}>{comment.time}</span>
          {comment.edited && <span className={styles.cmtEdited}>수정됨</span>}
        </div>

        {editing ? (
          <div className={styles.cmtEditWrap}>
            <input
              className={styles.cmtEditInput}
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
              autoFocus
            />
            <div className={styles.cmtEditBtns}>
              <button className={styles.cmtEditCancel} onClick={cancelEdit}>취소</button>
              <button className={`${styles.cmtEditSave} ${!editText.trim() ? styles.cmtEditSaveDisabled : ''}`} onClick={saveEdit} disabled={!editText.trim()}>저장</button>
            </div>
          </div>
        ) : (
          <p className={styles.cmtText}>{comment.text}</p>
        )}
      </div>

      {comment.isMine && !editing && (
        <div className={styles.cmtMenuWrap}>
          <button ref={btnRef} className={styles.cmtMenuBtn} onClick={openMenu} aria-label="더 보기">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className={styles.cmtMenuBackdrop} onClick={() => setMenuOpen(false)} />
              <div
                className={styles.cmtMenu}
                style={{ position: 'fixed', top: menuPos.top, right: menuPos.right }}
              >
                <button className={styles.cmtMenuItem} onClick={() => { setMenuOpen(false); setEditing(true) }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  수정
                </button>
                <button className={`${styles.cmtMenuItem} ${styles.cmtMenuItemDanger}`} onClick={() => { setMenuOpen(false); onDelete(comment.id) }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" /><path d="M14 11v6" />
                  </svg>
                  삭제
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── 댓글 바텀시트 ──────────────────────── */
function CommentSheet({ post, comments, onClose, onSubmit, onEditComment, onDeleteComment }) {
  const [text, setText] = useState('')
  const listRef         = useRef(null)

  const send = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(post.id, trimmed)
    setText('')
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }), 50)
  }

  return (
    <div className={styles.cmtOverlay} onClick={onClose}>
      <div className={styles.cmtSheet} onClick={e => e.stopPropagation()}>
        <div className={styles.cmtHandle} />

        <div className={styles.cmtHeader}>
          <span className={styles.cmtTitle}>댓글 {comments.length}개</span>
          <button className={styles.cmtCloseBtn} onClick={onClose} aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.cmtList} ref={listRef}>
          {comments.length === 0 ? (
            <div className={styles.cmtEmpty}>
              <span>💬</span>
              <p>첫 댓글을 남겨보세요</p>
            </div>
          ) : (
            comments.map(c => (
              <CommentItem
                key={c.id}
                comment={c}
                onEdit={(id, text) => onEditComment(post.id, id, text)}
                onDelete={(id) => onDeleteComment(post.id, id)}
              />
            ))
          )}
        </div>

        <div className={styles.cmtInputWrap}>
          <div className={styles.cmtInputAvatar}>{MY_AVATAR}</div>
          <input
            className={styles.cmtInput}
            placeholder="댓글을 입력해요..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          />
          <button
            className={`${styles.cmtSendBtn} ${!text.trim() ? styles.cmtSendBtnDisabled : ''}`}
            onClick={send}
            disabled={!text.trim()}
            aria-label="전송"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const PICKER_EMOJIS = ['💪', '🔥', '👏', '❤️', '😍', '🎉', '😂', '👍', '🙌', '✨', '😮', '🥹']

/* ─── 이모지 피커 ────────────────────────── */
const PICKER_W = 256 // 38px × 6 + padding

function EmojiPicker({ btnRef, onSelect, onClose }) {
  const [pos, setPos] = useState(null)

  // 버튼 위치 기준으로 picker 방향 결정
  useState(() => {
    const rect = btnRef.current?.getBoundingClientRect()
    if (!rect) return
    const bottom = window.innerHeight - rect.top + 8
    // 오른쪽 공간 충분 → left 정렬 / 부족 → right 정렬
    if (window.innerWidth - rect.left >= PICKER_W) {
      setPos({ bottom, left: rect.left })
    } else {
      setPos({ bottom, right: window.innerWidth - rect.right })
    }
  })

  if (!pos) return null

  return (
    <>
      <div className={styles.pickerBackdrop} onClick={onClose} />
      <div className={styles.pickerWrap} style={pos}>
        {PICKER_EMOJIS.map(e => (
          <button key={e} className={styles.pickerEmoji} onClick={() => { onSelect(e); onClose() }}>
            {e}
          </button>
        ))}
      </div>
    </>
  )
}

/* ─── 리액션 추가 버튼 ───────────────────── */
function AddReactionBtn({ onToggle }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef(null)

  return (
    <>
      <button ref={btnRef} className={styles.addReactionBtn} onClick={() => setOpen(o => !o)} aria-label="리액션 추가">＋</button>
      {open && <EmojiPicker btnRef={btnRef} onSelect={onToggle} onClose={() => setOpen(false)} />}
    </>
  )
}

/* ─── 게시물 카드 ────────────────────────── */
function PostCard({ post, isMyPost, reactions, myReactions, commentCount, onToggleReaction, onEdit, onDelete, onComment }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>{post.avatar}</div>
        <div className={styles.userInfo}>
          <span className={styles.nickname}>{post.nickname}</span>
          <span className={styles.timeText}>{post.relativeTime}</span>
        </div>
        {isMyPost && (
          <div className={styles.postMenuWrap}>
            <button className={styles.postMenuBtn} onClick={() => setMenuOpen(o => !o)} aria-label="더 보기">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className={styles.postMenuBackdrop} onClick={() => setMenuOpen(false)} />
                <div className={styles.postMenu}>
                  <button className={styles.postMenuItem} onClick={() => { setMenuOpen(false); onEdit(post) }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    수정
                  </button>
                  <button className={`${styles.postMenuItem} ${styles.postMenuItemDanger}`} onClick={() => { setMenuOpen(false); onDelete(post) }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className={styles.photoArea}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span className={styles.photoLabel}>인증 사진</span>
      </div>

      <div className={styles.timestampChip}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        {post.exactTime} 인증
      </div>

      <div className={styles.reactionsRow}>
        {reactions.map((r) => {
          const isMine = myReactions.has(r.emoji)
          return (
            <button
              key={r.emoji}
              className={`${styles.reactionBtn} ${isMine ? styles.reactionBtnMine : ''}`}
              onClick={() => onToggleReaction(r.emoji)}
            >
              {r.emoji}
              <span className={`${styles.reactionCount} ${isMine ? styles.reactionCountMine : ''}`}>{r.count}</span>
            </button>
          )
        })}
        <AddReactionBtn onToggle={onToggleReaction} />
      </div>

      <button className={`${styles.commentBtn} ${commentCount === 0 ? styles.commentEmpty : ''}`} onClick={() => onComment(post)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        {commentCount > 0 ? `댓글 ${commentCount}개` : '첫 댓글을 남겨보세요'}
      </button>
    </article>
  )
}

/* ─── 메인 페이지 ────────────────────────── */
export default function CategoryFeed() {
  const { category } = useParams()
  const navigate     = useNavigate()
  const location     = useLocation()
  const catName      = CATEGORY_NAMES[category] ?? category

  const { roomId, roomName, roomCategories } = location.state ?? {}

  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [calOpen, setCalOpen]           = useState(false)
  const [deletedIds, setDeletedIds]     = useState(new Set())
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [commentsMap, setCommentsMap]     = useState(INIT_COMMENTS)
  const [commentTarget, setCommentTarget] = useState(null)
  const [reactionsMap, setReactionsMap]   = useState(() => {
    const m = {}
    BASE_POSTS.forEach(p => { m[p.id] = p.reactions.map(r => ({ ...r })) })
    return m
  })
  const [myReactionsMap, setMyReactionsMap] = useState({}) // { postId: Set<emoji> }

  const toggleReaction = (postId, emoji) => {
    const mySet     = new Set(myReactionsMap[postId] ?? [])
    const hasReacted = mySet.has(emoji)

    // 내 리액션 토글
    const nextSet = new Set(mySet)
    hasReacted ? nextSet.delete(emoji) : nextSet.add(emoji)
    setMyReactionsMap(prev => ({ ...prev, [postId]: nextSet }))

    // 카운트 업데이트
    setReactionsMap(prev => {
      const list = [...(prev[postId] ?? [])]
      const idx  = list.findIndex(r => r.emoji === emoji)
      if (idx >= 0) {
        const next = list[idx].count + (hasReacted ? -1 : 1)
        return { ...prev, [postId]: next <= 0 ? list.filter((_, i) => i !== idx) : list.map((r, i) => i === idx ? { ...r, count: next } : r) }
      }
      return { ...prev, [postId]: [...list, { emoji, count: 1 }] }
    })
  }

  const allPosts  = POSTS_BY_DATE[selectedDate] ?? []
  const posts     = allPosts.filter(p => !deletedIds.has(p.id))
  const [y, m, d] = selectedDate.split('-')
  const dateLabel = `${y}.${m}.${d}`

  const goToUpload = () =>
    navigate('/upload', { state: { roomId, roomName, roomCategories, preselectedIds: [category] } })

  const handleEdit   = (post) =>
    navigate('/upload', { state: { roomId, roomName, roomCategories, preselectedIds: [category], editPost: post } })

  const handleDeleteRequest = (post) => setDeleteTarget(post)
  const handleDeleteConfirm = () => {
    setDeletedIds(prev => new Set([...prev, deleteTarget.id]))
    setDeleteTarget(null)
  }

  const handleCommentSubmit = (postId, text) => {
    const newComment = {
      id:       Date.now().toString(),
      avatar:   MY_AVATAR,
      nickname: MY_NICKNAME,
      text,
      time:   new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isMine: true,
    }
    setCommentsMap(prev => ({ ...prev, [postId]: [...(prev[postId] ?? []), newComment] }))
  }

  const handleCommentEdit = (postId, commentId, newText) => {
    setCommentsMap(prev => ({
      ...prev,
      [postId]: prev[postId].map(c => c.id === commentId ? { ...c, text: newText, edited: true } : c),
    }))
  }

  const handleCommentDelete = (postId, commentId) => {
    setCommentsMap(prev => ({
      ...prev,
      [postId]: prev[postId].filter(c => c.id !== commentId),
    }))
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.iconBtn} onClick={() => navigate(-1)} aria-label="뒤로">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div className={styles.headerCenter}>
          <span className={styles.headerCatName}>{catName}</span>
          <span className={styles.headerDate}>{dateLabel}</span>
        </div>
        <button className={styles.iconBtn} onClick={() => setCalOpen(true)} aria-label="날짜 선택">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </header>

      {selectedDate !== todayStr && (
        <div className={styles.todayBanner}>
          <button className={styles.todayChip} onClick={() => setSelectedDate(todayStr)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            오늘로 돌아가기
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      )}

      <div className={styles.main}>
        <p className={styles.feedDateLabel}>{dateLabel} 인증 피드 · {posts.length}개</p>
        <div className={styles.postList}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isMyPost={post.id === MY_POST_ID}
              reactions={reactionsMap[post.id] ?? []}
              myReactions={myReactionsMap[post.id] ?? new Set()}
              commentCount={(commentsMap[post.id] ?? []).length}
              onToggleReaction={(emoji) => toggleReaction(post.id, emoji)}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              onComment={setCommentTarget}
            />
          ))}
        </div>
      </div>

      {roomCategories && (
        <button className={styles.fab} onClick={goToUpload} aria-label="인증 올리기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </button>
      )}

      {calOpen && <CalendarModal selectedDate={selectedDate} onSelect={setSelectedDate} onClose={() => setCalOpen(false)} />}

      {deleteTarget && <DeleteConfirmModal onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />}

      {commentTarget && (
        <CommentSheet
          post={commentTarget}
          comments={commentsMap[commentTarget.id] ?? []}
          onClose={() => setCommentTarget(null)}
          onSubmit={handleCommentSubmit}
          onEditComment={handleCommentEdit}
          onDeleteComment={handleCommentDelete}
        />
      )}
    </div>
  )
}
