import { useState } from 'react'
import styles from './Stats.module.css'

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']

const VERIFIED_BY_MONTH = {
  '2026-04': [2,4,5,7,9,11,13,15,18,20,22,24,27,28],
  '2026-05': [1,2,3,5,6,7,8,9,12,13,14,15,16,19,20,21,22,23,25,26,27,28,29,30,31],
  '2026-06': [1, 2],
}

// 날짜별 인증 상세 (YYYY-MM-DD 키)
const DAILY_RECORDS = {
  '2026-05-21': [
    { category: '운동',     color: '#F06292', time: '오전 7:32' },
    { category: '독서',     color: '#BA68C8', time: '오전 8:15' },
    { category: '물 마시기', color: '#4FC3F7', time: '오후 2:14' },
  ],
  '2026-05-22': [
    { category: '운동',     color: '#F06292', time: '오전 6:58' },
    { category: '물 마시기', color: '#4FC3F7', time: '오후 1:30' },
  ],
  '2026-05-15': [
    { category: '운동',     color: '#F06292', time: '오전 7:45' },
    { category: '독서',     color: '#BA68C8', time: '오후 9:20' },
  ],
  '2026-05-09': [
    { category: '운동',     color: '#F06292', time: '오전 8:02' },
  ],
  '2026-06-01': [
    { category: '운동',     color: '#F06292', time: '오전 7:10' },
    { category: '독서',     color: '#BA68C8', time: '오전 8:40' },
  ],
  '2026-06-02': [
    { category: '운동',     color: '#F06292', time: '오전 7:32' },
    { category: '물 마시기', color: '#4FC3F7', time: '오후 12:05' },
  ],
}

const MOCK = {
  totalVerified: 47,
  streakDays:    7,
  roomCount:     3,
  weekActivity:  [true, true, true, true, true, true, false],
  rooms: [
    { id: '1', name: '아침 운동 챌린지 🏃', color: '#F06292', verified: 23, total: 31 },
    { id: '2', name: '독서 30분 📚',         color: '#BA68C8', verified: 14, total: 31 },
    { id: '3', name: '물 2L 마시기 💧',      color: '#4FC3F7', verified: 10, total: 31 },
  ],
}

/* ─── 날짜 상세 팝업 ─────────────────────── */
function DayDetailModal({ dateKey, onClose }) {
  const records = DAILY_RECORDS[dateKey]
  const [y, m, d] = dateKey.split('-')
  const dateLabel = `${parseInt(m)}월 ${parseInt(d)}일`

  return (
    <div className={styles.detailOverlay} onClick={onClose}>
      <div className={styles.detailModal} onClick={e => e.stopPropagation()}>
        <div className={styles.detailHeader}>
          <div>
            <p className={styles.detailDate}>{dateLabel}</p>
            <p className={styles.detailCount}>
              {records ? `${records.length}개 인증 완료 🎉` : '기록 없음'}
            </p>
          </div>
          <button className={styles.detailClose} onClick={onClose} aria-label="닫기">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.detailList}>
          {records?.map((r, i) => (
            <div key={i} className={styles.detailItem}>
              <span className={styles.detailDot} style={{ background: r.color }} />
              <span className={styles.detailCat}>{r.category}</span>
              <span className={styles.detailTime}>{r.time}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          ))}
        </div>

        <button className={styles.detailOkBtn} onClick={onClose}>확인</button>
      </div>
    </div>
  )
}

function StatCard({ value, label, gradient }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue} style={gradient ? { background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } : {}}>
        {value}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export default function Stats() {
  const today = new Date()

  const initYear  = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear()
  const initMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1
  const [calYear, setCalYear]   = useState(initYear)
  const [calMonth, setCalMonth] = useState(initMonth)
  const [selectedDay, setSelectedDay] = useState(null) // 'YYYY-MM-DD'

  const goPrev = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const goNext = () => {
    if (calYear === today.getFullYear() && calMonth === today.getMonth()) return
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }
  const isAtCurrent = calYear === today.getFullYear() && calMonth === today.getMonth()

  const daysInMonth    = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDow       = new Date(calYear, calMonth, 1).getDay()
  const isCurrentMonth = isAtCurrent
  const monthKey       = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`
  const verifiedDays   = VERIFIED_BY_MONTH[monthKey] ?? []
  const monthName      = `${calYear}년 ${calMonth + 1}월`

  const handleDayClick = (day, done) => {
    if (!done) return
    const key = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDay(key)
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>나의 기록</h1>
      </header>

      <div className={styles.main}>
        {/* 이번 주 */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionLabel}>이번 주</p>
            <span className={styles.streakBadge}>🔥 {MOCK.streakDays}일 연속</span>
          </div>
          <div className={styles.weekCard}>
            <div className={styles.weekRow}>
              {WEEK_DAYS.map((d, i) => (
                <div key={d} className={styles.weekCol}>
                  <div className={`${styles.weekDot} ${MOCK.weekActivity[i] ? styles.weekDotFilled : ''}`}>
                    {MOCK.weekActivity[i] && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className={styles.weekDay}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 전체 통계 */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>전체 통계</p>
          <div className={styles.statRow}>
            <StatCard value={`${MOCK.totalVerified}회`} label="총 인증"   gradient="linear-gradient(130deg, #F06292, #BA68C8)" />
            <StatCard value={`${MOCK.streakDays}일`}    label="연속 인증" gradient="linear-gradient(130deg, #F06292, #BA68C8)" />
            <StatCard value={`${MOCK.roomCount}개`}     label="참여 방"   gradient="linear-gradient(130deg, #F06292, #BA68C8)" />
          </div>
        </section>

        {/* 방별 인증 현황 */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>방별 인증 현황</p>
          <div className={styles.roomList}>
            {MOCK.rooms.map(r => {
              const pct = Math.round((r.verified / r.total) * 100)
              return (
                <div key={r.id} className={styles.roomRow}>
                  <div className={styles.roomInfo}>
                    <span className={styles.roomDot} style={{ background: r.color }} />
                    <span className={styles.roomName}>{r.name}</span>
                    <span className={styles.roomCount}>{r.verified}/{r.total}일</span>
                  </div>
                  <div className={styles.roomTrack}>
                    <div className={styles.roomFill} style={{ width: `${pct}%`, background: r.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 달력 */}
        <section className={styles.section}>
          <p className={styles.sectionLabel}>인증 캘린더</p>
          <div className={styles.calCard}>
            <div className={styles.calNav}>
              <button className={styles.calNavBtn} onClick={goPrev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className={styles.calMonthLabel}>{monthName}</span>
              <button
                className={`${styles.calNavBtn} ${isAtCurrent ? styles.calNavBtnDisabled : ''}`}
                onClick={goNext}
                disabled={isAtCurrent}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
            <div className={styles.calDow}>
              {WEEK_DAYS.map(d => <span key={d} className={styles.calDowCell}>{d}</span>)}
            </div>
            <div className={styles.calGrid}>
              {Array(firstDow).fill(null).map((_, i) => <span key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day      = i + 1
                const isToday  = isCurrentMonth && day === today.getDate()
                const isFuture = isCurrentMonth && day > today.getDate()
                const done     = !isFuture && verifiedDays.includes(day)
                return (
                  <div
                    key={day}
                    className={[
                      styles.calDay,
                      done     && styles.calDayDone,
                      isToday  && styles.calDayToday,
                      isFuture && styles.calDayFuture,
                    ].filter(Boolean).join(' ')}
                    onClick={() => handleDayClick(day, done)}
                  >
                    <span className={styles.calDayNum}>{day}</span>
                    {done && <span className={styles.calDayDot} />}
                  </div>
                )
              })}
            </div>
            <p className={styles.calHint}>인증한 날을 탭하면 기록을 볼 수 있어요</p>
          </div>
        </section>
      </div>

      {selectedDay && (
        <DayDetailModal
          dateKey={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  )
}
