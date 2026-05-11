import { useEffect, useRef } from 'react'

export default function BeamBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId, w, h

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const beams = Array.from({ length: 16 }, (_, i) => ({
      x: (window.innerWidth / 16) * i + Math.random() * 60 - 30,
      width: 1 + Math.random() * 2,
      opacity: 0.12 + Math.random() * 0.28,
      hue: 200 + Math.random() * 80,
      offset: Math.random() * 1000,
    }))

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * 1920, y: Math.random() * 1080,
      r: 0.5 + Math.random() * 1.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.1 - Math.random() * 0.25,
      o: 0.2 + Math.random() * 0.4,
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const bg = ctx.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, '#020408'); bg.addColorStop(0.5, '#050d1a'); bg.addColorStop(1, '#020408')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h)

      ;[[w*0.2,h*0.3,400,'rgba(99,102,241,0.07)'],[w*0.8,h*0.6,350,'rgba(139,92,246,0.06)'],[w*0.5,h*0.85,300,'rgba(59,130,246,0.05)']].forEach(([cx,cy,r,c]) => {
        const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r)
        g.addColorStop(0,c); g.addColorStop(1,'transparent')
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill()
      })

      beams.forEach(b => {
        const x = b.x + Math.sin((t + b.offset) * 0.002) * 50
        const gr = ctx.createLinearGradient(x,0,x,h)
        gr.addColorStop(0,'transparent')
        gr.addColorStop(0.3,`hsla(${b.hue},80%,70%,${b.opacity})`)
        gr.addColorStop(0.7,`hsla(${b.hue},90%,80%,${b.opacity*1.3})`)
        gr.addColorStop(1,'transparent')
        ctx.strokeStyle=gr; ctx.lineWidth=b.width
        ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x+Math.sin((t+b.offset)*0.003)*25,h); ctx.stroke()
      })

      particles.forEach(p => {
        p.x+=p.vx; p.y+=p.vy
        if(p.y<-5){p.y=h+5;p.x=Math.random()*w}
        if(p.x<-5)p.x=w+5; if(p.x>w+5)p.x=-5
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(180,200,255,${p.o})`; ctx.fill()
      })

      t++; animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} style={{ position:'fixed',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none' }} />
}
