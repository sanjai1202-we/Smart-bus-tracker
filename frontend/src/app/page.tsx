import Link from "next/link";
import { Bus, ShieldAlert, Clock, MapPin } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <div className="relative isolate w-full px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#14b8a6] to-[#047857] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-5 py-1 text-sm leading-6 text-primary-500 ring-1 ring-white/10 hover:ring-white/20 glass-panel">
              Multi-College Enterprise Architecture <a href="#features" className="font-semibold text-white ml-2"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Smart Bus Tracking for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-teal-200">Modern Campuses</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-textMuted">
            Real-time GPS locations, AI-powered ETA predictions, and instant safety alerts. One platform to manage multiple colleges seamlessly.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/login" className="rounded-md bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(20,184,166,0.5)]">
              Get Started
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-white hover:text-primary-500 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="py-24 sm:py-32 w-full glass-panel">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-500">Deploy Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to track buses
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-[0_0_15px_rgba(20,184,166,0.6)]">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  Real-time Tracking
                </dt>
                <dd className="mt-2 text-base leading-7 text-textMuted">Sub-second latency GPS updates routed through Redis Pub/Sub directly to student devices.</dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-[0_0_15px_rgba(20,184,166,0.6)]">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  AI ETA Prediction
                </dt>
                <dd className="mt-2 text-base leading-7 text-textMuted">Machine learning predicts arrival times by evaluating distance, historical data, and traffic conditions.</dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-[0_0_15px_rgba(20,184,166,0.6)]">
                    <ShieldAlert className="h-6 w-6 text-white" />
                  </div>
                  Safety Alerts
                </dt>
                <dd className="mt-2 text-base leading-7 text-textMuted">Overspeeding alerts and emergency notifications sent via WebSockets, SMS, and Push Notifications.</dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 shadow-[0_0_15px_rgba(20,184,166,0.6)]">
                    <Bus className="h-6 w-6 text-white" />
                  </div>
                  Multi-Tenant
                </dt>
                <dd className="mt-2 text-base leading-7 text-textMuted">Isolated database access and discrete college codes to maintain strict security across distinct institutions.</dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
