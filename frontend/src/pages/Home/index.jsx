import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheet from '../../components/common/BottomSheet'
import CreateRoomSheet from '../../components/bottomsheets/CreateRoomSheet'
import EnterInviteCodeSheet from '../../components/bottomsheets/EnterInviteCodeSheet'
import styles from './Home.module.css'

const MOCK_ROOMS = [
  {
    id: '1',
    name: '아침 운동 챌린지 🏃',
    memberCount: 5,
    todayVerified: 3,
    categories: ['운동', '건강', '아침루틴'],
  },
  {
    id: '2',
    name: '독서 30분 📚',
    memberCount: 4,
    todayVerified: 4,
    categories: ['독서', '자기계발'],
  },
  {
    id: '3',
    name: '물 2L 마시기 💧',
    memberCount: 6,
    todayVerified: 1,
    categories: ['건강', '습관'],
  },
  {
    id: '4',
    name: '일찍 자기 🌙',
    memberCount: 3,
    todayVerified: 0,
    categories: ['수면', '건강'],
  },
  {
    id: '5',
    name: '매일 영어 한마디 🌎',
    memberCount: 8,
    todayVerified: 5,
    categories: ['영어', '자기계발', '언어'],
  },
]

const CHIP_COLORS = [
  { bg: '#FFD6E0', color: '#C2185B' },
  { bg: '#EDE0FB', color: '#6A1B9A' },
  { bg: '#D0EFFF', color: '#0277BD' },
  { bg: '#FFF9C4', color: '#E65100' },
  { bg: '#FFE0D0', color: '#BF360C' },
]

function VerifyBadge({ verified, total }) {
  if (verified === total) {
    return <span className={`${styles.badge} ${styles.badgeAll}`}>모두 완료 ✅</span>
  }
  if (verified === 0) {
    return <span className={`${styles.badge} ${styles.badgeNone}`}>아직 0명</span>
  }
  return (
    <span className={`${styles.badge} ${styles.badgePartial}`}>
      {verified}/{total} 완료
    </span>
  )
}

function RoomCard({ room }) {
  const navigate = useNavigate()

  return (
    <div className={styles.card} onClick={() => navigate(`/room/${room.id}`)}>
      <div className={styles.cardTop}>
        <span className={styles.roomName}>{room.name}</span>
        <VerifyBadge verified={room.todayVerified} total={room.memberCount} />
      </div>

      <div className={styles.memberRow}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>{room.memberCount}명 참여 중</span>
      </div>

      <div className={styles.chips}>
        {room.categories.map((cat, i) => (
          <span
            key={cat}
            className={styles.chip}
            style={CHIP_COLORS[i % CHIP_COLORS.length]}
          >
            {cat}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [sheet, setSheet] = useState(null)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>didyou<span className={styles.titleEmoji}>👀</span></h1>
        <button className={styles.notifBtn} aria-label="알림">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notifDot} />
        </button>
      </header>

      <div className={styles.main}>
        <p className={styles.sectionLabel}>참여 중인 방</p>
        <div className={styles.cardList}>
          {MOCK_ROOMS.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>

      <button
        className={styles.fab}
        onClick={() => setSheet('select')}
        aria-label="방 참여"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* 방 참여 선택 시트 */}
      <BottomSheet isOpen={sheet === 'select'} onClose={() => setSheet(null)}>
        <div className={styles.selectSheet}>
          <p className={styles.selectTitle}>어떻게 시작할까요?</p>
          <button className={styles.selectItem} onClick={() => setSheet('create')}>
            <span className={styles.selectEmoji}>🏠</span>
            <div className={styles.selectItemText}>
              <span className={styles.selectItemTitle}>방 만들기</span>
              <span className={styles.selectItemDesc}>새로운 챌린지 방을 만들어요</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button className={styles.selectItem} onClick={() => setSheet('enter')}>
            <span className={styles.selectEmoji}>🔑</span>
            <div className={styles.selectItemText}>
              <span className={styles.selectItemTitle}>초대코드 입력</span>
              <span className={styles.selectItemDesc}>친구의 코드를 입력하고 참여해요</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </BottomSheet>

      <CreateRoomSheet isOpen={sheet === 'create'} onClose={() => setSheet(null)} />
      <EnterInviteCodeSheet isOpen={sheet === 'enter'} onClose={() => setSheet(null)} />
    </div>
  )
}
