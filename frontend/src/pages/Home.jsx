import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h1 className="text-7xl md:text-8xl mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
          Mac's Pizza
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-xl" style={{ fontFamily: 'var(--font-body)', color: 'var(--brown)' }}>
          Handcrafted pies made with love, fresh ingredients, and a whole lot of cheese.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/menu" className="btn btn-primary btn-lg">
            Order Now
          </Link>
          <Link to="/menu" className="btn btn-secondary btn-lg">
            View Menu
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="section-banner mb-12">
          <h2>Why Mac's?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🍕', title: 'Fresh Daily', desc: 'Dough made from scratch every morning.' },
            { icon: '🚀', title: 'Fast Delivery', desc: 'Hot to your door in 30 minutes or less.' },
            { icon: '❤️', title: 'Made with Love', desc: 'Family recipes passed down for generations.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="card p-8 flex flex-col items-center text-center gap-4">
              <span className="text-5xl">{icon}</span>
              <h3 className="text-2xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--red-dark)' }}>
                {title}
              </h3>
              <p style={{ color: 'var(--brown)' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
