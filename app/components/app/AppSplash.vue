<script setup lang="ts">
const isDark = useIsDark()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const theme = computed(() => getTheme(isDark.value))

// ======= TYPES =======
type Point = { x: number; y: number }
type Edge = { p1: Point; p2: Point; adj: Edge[] }
type Hex = { cx: number; cy: number; pts: Point[]; dist: number }
type Particle = { x: number; y: number; vx: number; vy: number; r: number; maxLife: number; born: number }
type Stream = { hueOff: number; path: Edge[]; t: number; speed: number; streamLen: number }
type RConf = { R: number; GAP: number; STREAMS: number; STREAM_LEN: number; PARTICLE_COUNT: number; ORBITAL_R: number; EMBLEM_R: number }
type Scene = { vw: number; vh: number; cx0: number; cy0: number; hexes: Hex[]; maxDist: number; edges: Edge[]; particles: Particle[]; streams: Stream[]; conf: RConf }
type Theme = {
  gridStroke: string; gridFill: string
  hueBase: number; hueRange: number
  streamSat: number; streamLit: number; coreLit: number; coreSat: number
  ambientC1: [number, number, number]; ambientC2: [number, number, number]
  ambientA1: number; ambientA2: number
  particleHue: number; particleAlpha: number; pulseAlpha: number
  logoColor: [number, number, number]; logoAlpha: number; logoGlowAlpha: number
}

function getTheme(dark: boolean): Theme {
  return dark ? {
    gridStroke: 'rgba(74,245,255,0.07)', gridFill: 'rgba(10,14,28,0.4)',
    hueBase: 175, hueRange: 60, streamSat: 95, streamLit: 65, coreLit: 92, coreSat: 70,
    ambientC1: [74, 245, 255], ambientC2: [139, 92, 246], ambientA1: 0.05, ambientA2: 0.035,
    particleHue: 185, particleAlpha: 0.7, pulseAlpha: 0.35,
    logoColor: [74, 245, 255], logoAlpha: 0.06, logoGlowAlpha: 0.12,
  } : {
    gridStroke: 'rgba(59,130,246,0.1)', gridFill: 'rgba(255,255,255,0.45)',
    hueBase: 220, hueRange: 50, streamSat: 80, streamLit: 52, coreLit: 96, coreSat: 40,
    ambientC1: [59, 130, 246], ambientC2: [168, 85, 247], ambientA1: 0.07, ambientA2: 0.045,
    particleHue: 225, particleAlpha: 0.5, pulseAlpha: 0.18,
    logoColor: [59, 130, 246], logoAlpha: 0.07, logoGlowAlpha: 0.10,
  }
}

function getRConf(vw: number, vh: number): RConf {
  const m = Math.min(vw, vh)
  const R = Math.max(14, Math.min(26, m * 0.035))
  return {
    R, GAP: Math.max(1.5, R * 0.115),
    STREAMS: m < 480 ? 25 : m < 768 ? 35 : 55,
    STREAM_LEN: m < 480 ? 4 : 6,
    PARTICLE_COUNT: m < 480 ? 35 : m < 768 ? 55 : 80,
    ORBITAL_R: Math.max(40, Math.min(85, m * 0.1)),
    EMBLEM_R: Math.max(16, Math.min(32, m * 0.04)),
  }
}

function buildScene(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Scene {
  const dpr = window.devicePixelRatio || 1
  const vw = window.innerWidth, vh = window.innerHeight
  const conf = getRConf(vw, vh)
  const { R, GAP } = conf
  canvas.width = vw * dpr; canvas.height = vh * dpr
  canvas.style.width = vw + 'px'; canvas.style.height = vh + 'px'
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(dpr, dpr)
  const cx0 = vw / 2, cy0 = vh / 2
  const sqrt3 = Math.sqrt(3)
  const hexW = sqrt3 * (R + GAP), hexH = 1.5 * (R + GAP)
  const cols = Math.ceil(vw / hexW) + 3, rows = Math.ceil(vh / hexH) + 3
  const ox = (vw - cols * hexW) / 2 + hexW / 2
  const oy = (vh - (rows * hexH + R)) / 2 + R
  const hexCorner = (cx: number, cy: number, i: number): Point => {
    const a = Math.PI / 3 * i - Math.PI / 6
    return { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }
  }
  const hexes: Hex[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = ox + c * hexW + (r & 1 ? hexW * 0.5 : 0)
      const cy = oy + r * hexH
      const pts = Array.from({ length: 6 }, (_, i) => hexCorner(cx, cy, i))
      hexes.push({ cx, cy, pts, dist: Math.hypot(cx - cx0, cy - cy0) })
    }
  }
  const maxDist = hexes.reduce((m, h) => Math.max(m, h.dist), 0)
  const rnd = (v: number) => Math.round(v * 100)
  const vkey = (p: Point) => `${rnd(p.x)},${rnd(p.y)}`
  const ekey = (a: Point, b: Point) => {
    const [ax, ay, bx, by] = [rnd(a.x), rnd(a.y), rnd(b.x), rnd(b.y)]
    return ax < bx || (ax === bx && ay < by) ? `${ax},${ay}|${bx},${by}` : `${bx},${by}|${ax},${ay}`
  }
  const edgeMap = new Map<string, Edge>()
  const edges: Edge[] = []
  const vtxEdges = new Map<string, Edge[]>()
  for (const h of hexes) {
    for (let i = 0; i < 6; i++) {
      const p1 = h.pts[i]!, p2 = h.pts[(i + 1) % 6]!
      const k = ekey(p1, p2)
      if (!edgeMap.has(k)) {
        const e: Edge = { p1, p2, adj: [] }
        edgeMap.set(k, e); edges.push(e)
        for (const p of [p1, p2]) {
          const vk = vkey(p)
          if (!vtxEdges.has(vk)) vtxEdges.set(vk, [])
          vtxEdges.get(vk)!.push(e)
        }
      }
    }
  }
  for (const e of edges) {
    const set = new Set<Edge>()
    for (const p of [e.p1, e.p2])
      for (const ne of vtxEdges.get(vkey(p)) ?? [])
        if (ne !== e) set.add(ne)
    e.adj = [...set]
  }
  const particles: Particle[] = Array.from({ length: conf.PARTICLE_COUNT }, () => {
    const p = createParticle(vw, vh); p.born = Math.random() * p.maxLife; return p
  })
  const theme = getTheme(isDark.value)
  const streams: Stream[] = Array.from({ length: conf.STREAMS }, () => createStream(edges, conf.STREAM_LEN, theme))
  return { vw, vh, cx0, cy0, hexes, maxDist, edges, particles, streams, conf }
}

function createParticle(vw: number, vh: number): Particle {
  return { x: Math.random() * vw, y: Math.random() * vh, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 - 0.15, r: Math.random() * 2 + 0.5, maxLife: 3000 + Math.random() * 4000, born: 0 }
}
function resetParticle(p: Particle, vw: number, vh: number) { Object.assign(p, createParticle(vw, vh)) }
function updateParticle(p: Particle, dt: number, vw: number, vh: number) {
  p.x += p.vx * dt; p.y += p.vy * dt; p.born += dt
  if (p.born > p.maxLife || p.x < -20 || p.x > vw + 20 || p.y < -20 || p.y > vh + 20) resetParticle(p, vw, vh)
}
function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, theme: Theme, alpha: number) {
  const lr = p.born / p.maxLife
  const fade = lr < 0.15 ? lr / 0.15 : lr > 0.8 ? (1 - lr) / 0.2 : 1
  const a = fade * theme.particleAlpha * alpha
  if (a < 0.01) return
  const hue = theme.particleHue + Math.sin(p.born * 0.001) * 30
  ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  ctx.fillStyle = `hsla(${hue},80%,75%,${a})`
  ctx.shadowColor = `hsla(${hue},90%,65%,${a * 0.6})`; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0
}
function createStream(edges: Edge[], streamLen: number, theme: Theme): Stream {
  const s: Stream = { hueOff: Math.random() * theme.hueRange, path: [edges[Math.floor(Math.random() * edges.length)]!], t: Math.random(), speed: 0.01 + Math.random() * 0.008, streamLen }
  while (s.path.length < streamLen) growStream(s)
  return s
}
function growStream(s: Stream) {
  const last = s.path[s.path.length - 1]!
  const prev = s.path.length > 1 ? s.path[s.path.length - 2] : null
  const cands = last.adj.filter(e => e !== prev)
  s.path.push((cands.length ? cands : last.adj)[Math.floor(Math.random() * (cands.length || last.adj.length))]!)
}
function updateStream(s: Stream, dt: number) {
  s.t += s.speed * dt
  while (s.t >= 1) { s.t -= 1; s.path.shift(); growStream(s) }
}
function drawStream(ctx: CanvasRenderingContext2D, s: Stream, theme: Theme, alpha: number, now: number) {
  const len = s.path.length
  for (let i = 0; i < len; i++) {
    const e = s.path[i]!
    const a = ((i + 1 - s.t) / len) ** 2 * 0.75 * alpha
    if (a < 0.005) continue
    const h = theme.hueBase + s.hueOff + i * 5 + Math.sin(now * 0.0008) * 10
    ctx.beginPath(); ctx.moveTo(e.p1.x, e.p1.y); ctx.lineTo(e.p2.x, e.p2.y)
    ctx.strokeStyle = `hsla(${h},${theme.streamSat}%,${theme.streamLit}%,${a})`
    ctx.lineWidth = 3; ctx.shadowColor = `hsla(${h},100%,55%,${a * 0.6})`; ctx.shadowBlur = 16; ctx.stroke()
    ctx.beginPath(); ctx.moveTo(e.p1.x, e.p1.y); ctx.lineTo(e.p2.x, e.p2.y)
    ctx.strokeStyle = `hsla(${h},${theme.coreSat}%,${theme.coreLit}%,${a * 0.9})`
    ctx.lineWidth = 1; ctx.shadowBlur = 4; ctx.stroke()
  }
  ctx.shadowBlur = 0
}
function drawGrid(ctx: CanvasRenderingContext2D, theme: Theme, alpha: number, now: number, sc: Scene) {
  ctx.lineWidth = 0.8
  const pulseT = (now % 3500) / 3500
  const pulseRadius = pulseT * sc.maxDist * 1.2
  const pulseWidth = sc.maxDist * 0.18
  for (const h of sc.hexes) {
    const dFromPulse = Math.abs(h.dist - pulseRadius)
    const pi = dFromPulse < pulseWidth ? (1 - dFromPulse / pulseWidth) * (1 - pulseT) * theme.pulseAlpha : 0
    ctx.beginPath(); ctx.moveTo(h.pts[0]!.x, h.pts[0]!.y)
    for (let i = 1; i < 6; i++) ctx.lineTo(h.pts[i]!.x, h.pts[i]!.y)
    ctx.closePath()
    ctx.fillStyle = pi > 0.01 ? `hsla(${theme.hueBase + 10},80%,60%,${pi * alpha})` : theme.gridFill
    ctx.fill(); ctx.strokeStyle = theme.gridStroke
    ctx.globalAlpha = (1 - (h.dist / sc.maxDist) * 0.3) * alpha; ctx.stroke(); ctx.globalAlpha = 1
  }
}
function drawAmbient(ctx: CanvasRenderingContext2D, theme: Theme, now: number, alpha: number, sc: Scene) {
  const pulse = 0.35 + 0.15 * Math.sin(now * 0.0015)
  const [c1, c2] = [theme.ambientC1, theme.ambientC2]
  const g = ctx.createRadialGradient(sc.cx0, sc.cy0, 0, sc.cx0, sc.cy0, sc.vw * 0.42)
  g.addColorStop(0, `rgba(${c1},${pulse * theme.ambientA1 * alpha})`); g.addColorStop(0.5, `rgba(${c2},${pulse * theme.ambientA2 * alpha})`); g.addColorStop(1, 'transparent')
  ctx.fillStyle = g; ctx.fillRect(0, 0, sc.vw, sc.vh)
  const angle = now * 0.0002
  const [rx, ry] = [sc.cx0 + Math.cos(angle) * sc.vw * 0.15, sc.cy0 + Math.sin(angle) * sc.vh * 0.15]
  const g2 = ctx.createRadialGradient(rx, ry, 0, rx, ry, sc.vw * 0.3)
  g2.addColorStop(0, `rgba(${c2},${pulse * 0.03 * alpha})`); g2.addColorStop(1, 'transparent')
  ctx.fillStyle = g2; ctx.fillRect(0, 0, sc.vw, sc.vh)
}
function drawOrbital(ctx: CanvasRenderingContext2D, theme: Theme, now: number, alpha: number, sc: Scene) {
  const { ORBITAL_R: ringR } = sc.conf
  const dotR = Math.max(1.5, ringR * 0.035), trailR = Math.max(1, ringR * 0.024)
  for (let i = 0; i < 3; i++) {
    const angle = now * 0.001 * (1 + i * 0.3) + i * Math.PI * 2 / 3
    const [ax, ay] = [sc.cx0 + Math.cos(angle) * ringR, sc.cy0 + Math.sin(angle) * ringR]
    const hue = theme.hueBase + i * 40
    ctx.beginPath(); ctx.arc(ax, ay, dotR, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${hue},90%,70%,${0.7 * alpha})`
    ctx.shadowColor = `hsla(${hue},100%,60%,${0.5 * alpha})`; ctx.shadowBlur = 12; ctx.fill()
    for (let t = 1; t <= 8; t++) {
      const ta = angle - t * 0.08
      ctx.beginPath(); ctx.arc(sc.cx0 + Math.cos(ta) * ringR, sc.cy0 + Math.sin(ta) * ringR, trailR * (1 - t / 9), 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${hue},80%,65%,${(1 - t / 9) * 0.3 * alpha})`; ctx.fill()
    }
  }
  ctx.shadowBlur = 0
  ctx.beginPath(); ctx.arc(sc.cx0, sc.cy0, ringR, 0, Math.PI * 2)
  ctx.strokeStyle = `hsla(${theme.hueBase},60%,60%,${0.06 * alpha})`; ctx.lineWidth = 1; ctx.stroke()
}
function drawEmblem(ctx: CanvasRenderingContext2D, theme: Theme, now: number, alpha: number, sc: Scene) {
  const r = sc.conf.EMBLEM_R * (1 + 0.04 * Math.sin(now * 0.002))
  const hue = theme.hueBase
  ctx.save(); ctx.translate(sc.cx0, sc.cy0); ctx.rotate(now * 0.0003)
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 3 * i - Math.PI / 6
    i === 0 ? ctx.moveTo(r * Math.cos(a), r * Math.sin(a)) : ctx.lineTo(r * Math.cos(a), r * Math.sin(a))
  }
  ctx.closePath()
  ctx.strokeStyle = `hsla(${hue},80%,65%,${0.5 * alpha})`; ctx.lineWidth = Math.max(1, sc.conf.EMBLEM_R * 0.047)
  ctx.shadowColor = `hsla(${hue},100%,60%,${0.4 * alpha})`; ctx.shadowBlur = 20; ctx.stroke(); ctx.shadowBlur = 0
  ctx.fillStyle = `hsla(${hue},60%,50%,${0.04 * alpha})`; ctx.fill()
  ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2)
  ctx.strokeStyle = `hsla(${hue + 40},70%,65%,${0.25 * alpha})`; ctx.lineWidth = 1; ctx.stroke()
  ctx.beginPath(); ctx.arc(0, 0, Math.max(1.5, sc.conf.EMBLEM_R * 0.08), 0, Math.PI * 2)
  ctx.fillStyle = `hsla(${hue},80%,80%,${0.6 * alpha})`
  ctx.shadowColor = `hsla(${hue},100%,70%,${0.5 * alpha})`; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0
  ctx.restore()
}
function drawBgLogo(ctx: CanvasRenderingContext2D, theme: Theme, now: number, alpha: number, sc: Scene) {
  const c = theme.logoColor
  const minSide = Math.min(sc.vw, sc.vh)
  const fontSize = Math.min(sc.vw * 0.11, minSide * 0.18, 160) * (1 + 0.03 * Math.sin(now * 0.001))
  const hue = theme.hueBase
  ctx.save(); ctx.translate(sc.cx0, sc.cy0); ctx.rotate(Math.sin(now * 0.0002) * 0.02)
  ctx.font = `900 ${fontSize}px 'Segoe UI', 'Microsoft YaHei', sans-serif`
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  const glow = theme.logoGlowAlpha * alpha * (0.7 + 0.3 * Math.sin(now * 0.0012))
  for (const [blur, aScale] of [[Math.max(20, fontSize * 0.38), 0.3], [Math.max(10, fontSize * 0.19), 0.5]] as [number, number][]) {
    ctx.shadowColor = `rgba(${c},${glow})`; ctx.shadowBlur = blur
    ctx.fillStyle = `rgba(${c},${theme.logoAlpha * alpha * aScale})`; ctx.fillText('Echo-Otaku', 0, 0)
  }
  const shimmerX = Math.sin(now * 0.0006) * sc.vw * 0.3
  const span = Math.max(150, fontSize * 2)
  const grad = ctx.createLinearGradient(shimmerX - span, 0, shimmerX + span, 0)
  const ba = theme.logoAlpha * alpha
  grad.addColorStop(0, `hsla(${hue},80%,65%,${ba * 0.7})`)
  grad.addColorStop(0.4, `hsla(${hue + 30},70%,75%,${ba * 1.2})`)
  grad.addColorStop(0.5, `hsla(${hue + 60},60%,80%,${ba * 1.5})`)
  grad.addColorStop(0.6, `hsla(${hue + 30},70%,75%,${ba * 1.2})`)
  grad.addColorStop(1, `hsla(${hue},80%,65%,${ba * 0.7})`)
  ctx.shadowBlur = Math.max(4, fontSize * 0.075); ctx.fillStyle = grad; ctx.fillText('Echo-Otaku', 0, 0)
  ctx.shadowBlur = 0
  ctx.strokeStyle = `rgba(${c},${ba * 0.4})`; ctx.lineWidth = Math.max(0.5, fontSize * 0.006); ctx.strokeText('Echo-Otaku', 0, 0)
  ctx.restore()
}

let _sc: Scene | null = null
let _ctx: CanvasRenderingContext2D | null = null
let prevT = 0
let animFrame: number | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null

function handleResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    if (canvasRef.value && _ctx) _sc = buildScene(canvasRef.value, _ctx)
  }, 150)
}

function frame(now: number) {
  if (!_sc || !_ctx) { animFrame = requestAnimationFrame(frame); return }
  const sc = _sc, ctx = _ctx
  const dt = Math.min(now - prevT, 50)
  prevT = now
  const t = theme.value
  ctx.clearRect(0, 0, sc.vw, sc.vh)
  drawGrid(ctx, t, 1, now, sc)
  drawAmbient(ctx, t, now, 1, sc)
  drawBgLogo(ctx, t, now, 1, sc)
  for (const p of sc.particles) { updateParticle(p, dt, sc.vw, sc.vh); drawParticle(ctx, p, t, 1) }
  for (const s of sc.streams) { updateStream(s, dt); drawStream(ctx, s, t, 1, now) }
  drawOrbital(ctx, t, now, 1, sc)
  drawEmblem(ctx, t, now, 1, sc)
  animFrame = requestAnimationFrame(frame)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const canvas = canvasRef.value
  if (!canvas) return
  _ctx = canvas.getContext('2d')!
  _sc = buildScene(canvas, _ctx)
  prevT = performance.now()
  animFrame = requestAnimationFrame(frame)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animFrame !== null) cancelAnimationFrame(animFrame)
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    class="fixed inset-0 z-[9999] overflow-hidden flex flex-col items-center justify-end pb-[8%]"
    :style="{ background: isDark ? '#060a14' : '#f0f2f5' }"
  >
    <canvas ref="canvasRef" class="absolute inset-0" />

    <div
      class="relative flex flex-col items-center gap-3 px-6 py-4 rounded-xl backdrop-blur-md border"
      :class="isDark
        ? 'bg-[rgba(6,10,20,0.55)] border-[rgba(74,245,255,0.12)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
        : 'bg-[rgba(255,255,255,0.6)] border-[rgba(59,130,246,0.18)] shadow-[0_8px_32px_rgba(0,0,0,0.08)]'"
    >
      <span
        class="text-xs font-medium tracking-[5px] uppercase"
        :class="isDark ? 'text-[rgba(74,245,255,0.8)]' : 'text-[rgba(59,130,246,0.9)]'"
      >Loading</span>

      <div
        class="w-44 h-[2px] rounded overflow-hidden"
        :class="isDark ? 'bg-[rgba(74,245,255,0.06)]' : 'bg-[rgba(59,130,246,0.1)]'"
      >
        <div
          class="h-full rounded animate-[loading_1.8s_ease-in-out_infinite]"
          :class="isDark
            ? 'bg-gradient-to-r from-[#4af5ff] via-[#a78bfa] to-[#f472b6]'
            : 'bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes loading {
  0% { width: 0%; margin-left: 0; }
  50% { width: 70%; margin-left: 15%; }
  100% { width: 0%; margin-left: 100%; }
}
</style>
