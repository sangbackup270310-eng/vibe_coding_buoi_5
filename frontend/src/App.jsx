import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white font-semibold">
            T
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-slate-900">
              Try-on
            </span>
            <span className="text-xs text-slate-500">
              Virtual fitting room
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <a href="#features" className="hover:text-violet-600">
            Tính năng
          </a>
          <a href="#how-it-works" className="hover:text-violet-600">
            Cách hoạt động
          </a>
          <a href="#cta" className="hover:text-violet-600">
            Bắt đầu
          </a>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <Link
            to="/login"
            className="hidden text-slate-700 hover:text-violet-600 sm:inline"
          >
            Đăng nhập
          </Link>
          <button className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-slate-800">
            Thử đồ ngay
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:py-20">
        <div className="w-full space-y-6 md:w-1/2">
          <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200">
            GenAI4Dev K1 · Fashion Tech
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Phòng thử đồ ảo cho{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              fashionista
            </span>
          </h1>
          <p className="max-w-xl text-balance text-sm text-slate-300 sm:text-base">
            Upload ảnh toàn thân của bạn, chọn món đồ yêu thích và để AI lo phần
            còn lại. Không cần xếp hàng, không cần thay đồ – chỉ cần một cú
            click.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-violet-500/30 hover:bg-slate-100">
              Bắt đầu thử đồ
              <span className="text-lg leading-none">↗</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-slate-50 hover:border-white/40">
              Xem demo 30s
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300">
            <div className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live preview sau vài giây
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Hỗ trợ body đa dạng
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-10 -z-10 bg-gradient-to-tr from-violet-500/40 via-fuchsia-500/30 to-amber-400/30 blur-3xl" />
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-900/50 backdrop-blur">
              <div className="flex items-center justify-between px-1 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] text-slate-200">
                  Virtual try-on preview
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
                <div className="flex gap-0.5 bg-slate-900/80 p-2 text-[10px] text-slate-300">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 font-medium text-violet-200">
                    Bạn
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5">
                    Áo thun oversize
                  </span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5">
                    Quần jeans straight
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-0.5 p-3">
                  <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 p-3">
                    <div className="h-40 rounded-lg bg-[radial-gradient(circle_at_20%_0,rgba(129,140,248,.35),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(248,250,252,.18),transparent_55%)]" />
                    <p className="text-xs font-medium text-slate-100">
                      Ảnh gốc của bạn
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Chỉ dùng để xử lý trực tiếp, không chia sẻ bên ngoài.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-b from-violet-900/80 to-slate-950 p-3">
                    <div className="h-40 rounded-lg bg-[radial-gradient(circle_at_10%_0,rgba(196,181,253,.8),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(248,250,252,.35),transparent_55%)]" />
                    <p className="text-xs font-medium text-slate-100">
                      Kết quả AI Try-on
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Xem ngay outfit mới trên chính cơ thể bạn.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/10 bg-slate-900/80 px-3 py-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Thời gian xử lý trung bình</span>
                    <span className="font-semibold text-emerald-300">
                      &lt; 10 giây
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'Phù hợp với từng dáng người',
      description:
        'Hệ thống tối ưu cho nhiều tỷ lệ cơ thể khác nhau, không chỉ cho chuẩn mẫu studio.',
      tag: 'US-02 · Hồ sơ khách hàng',
    },
    {
      title: 'Kho đồ fashion-ready',
      description:
        'Quản lý danh mục, sản phẩm và ảnh flat lay để dễ dàng mix & match outfit.',
      tag: 'Epic 2 · Quản lý kho hàng',
    },
    {
      title: 'Trải nghiệm thử đồ mượt mà',
      description:
        'Chuyển outfit chỉ với một cú chạm, giữ nguyên background & dáng pose của bạn.',
      tag: 'Epic 3 · Phòng thử đồ',
    },
  ];

  return (
    <section id="features" className="bg-slate-950 py-16 text-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
              Sản phẩm
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Được thiết kế cho e-commerce thời trang
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300">
            Từ hồ sơ khách hàng, kho sản phẩm đến phòng thử đồ ảo – mọi thứ đều
            kết nối trong một luồng trải nghiệm thống nhất.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map(feature => (
            <article
              key={feature.title}
              className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.7)]"
            >
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-200 ring-1 ring-violet-500/30">
                  {feature.tag}
                </span>
                <h3 className="text-base font-semibold text-slate-50 group-hover:text-violet-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-300">{feature.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-[11px] text-slate-400">
                <span>Optimized for conversion</span>
                <span className="text-violet-300">Learn more ↗</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      title: '1. Tạo hồ sơ',
      description:
        'Đăng ký, upload ảnh toàn thân, nhập chiều cao & cân nặng để hệ thống nhận diện dáng người.',
    },
    {
      title: '2. Chọn outfit',
      description:
        'Chọn danh mục (áo, váy, quần) và sản phẩm yêu thích từ kho hàng được quản lý bởi admin.',
    },
    {
      title: '3. Thử & mua',
      description:
        'Xem kết quả try-on, chuyển sản phẩm tiếp theo, thêm vào giỏ và hoàn tất đơn hàng.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-y border-slate-800 bg-slate-950 py-16"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Flow
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
            Luồng trải nghiệm thử đồ liền mạch
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Được thiết kế để bám sát các user stories trong Sprint 1: từ auth,
            profile đến trải nghiệm thử đồ.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {steps.map(step => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="absolute -top-3 left-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-slate-200 ring-1 ring-slate-700">
                {step.title.split('.')[0]}
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-50">
                {step.title}
              </h3>
              <p className="mt-2 text-xs text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section
      id="cta"
      className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400 py-12"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-slate-950 md:flex-row">
        <div>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Sẵn sàng mở phòng thử đồ ảo đầu tiên của bạn?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-slate-900/80">
            Bắt đầu với sprint auth/profile, sau đó mở rộng sang kho hàng và
            trải nghiệm try-on cho khách hàng thật.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-amber-100 shadow-lg shadow-slate-900/40 hover:bg-slate-900">
            Bắt đầu Sprint 1
          </button>
          <button className="rounded-full border border-slate-900/40 bg-white/30 px-4 py-2 text-xs font-medium text-slate-950 hover:bg-white/60">
            Xem Product Backlog
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-6 text-xs text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
        <p>© {new Date().getFullYear()} Try-on · GenAI4Dev K1.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/tungdtfgw/try-on-starter"
            target="_blank"
            rel="noreferrer"
            className="hover:text-violet-300"
          >
            Starter repo
          </a>
          <a
            href="https://github.com/sangbackup270310-eng/vibe_coding_buoi_5"
            target="_blank"
            rel="noreferrer"
            className="hover:text-violet-300"
          >
            Project repo
          </a>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
