import Button from "../components/Button";
function Hero() {
  return (
     

     <section className="max-w-7xl mx-auto px-8 py-24">

  <div className="grid lg:grid-cols-2 gap-16 items-center">

    

    <div>

  
      <p className="uppercase tracking-[0.35em] text-cyan-400 font-semibold mb-5">
        VERIDICT
      </p>

     
      <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">

        <span className="text-white">Verify.</span>

        <br />

        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Code.
        </span>

        <br />

        <span className="text-white">Conquer.</span>

      </h1>

    

      <p className="mt-8 max-w-2xl text-slate-300 text-lg leading-8">
        Master competitive programming with AI-powered code reviews,
        real-time judging, coding contests, performance analytics,
        and an intelligent practice environment built for developers.
      </p>


      <div className="flex flex-col sm:flex-row gap-5 mt-10">

  <Button>
  Launch Veridict →
</Button>

  <Button variant="secondary">
  AI Review
</Button>

</div>

    </div>

   

<div className="relative flex justify-center items-center">

 

  <div className="w-full max-w-[450px] h-[420px] lg:h-[450px] rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-slate-700 shadow-2xl flex items-center justify-center">

    <div className="space-y-5 w-[85%]">

     

      <div className="flex gap-2">

        <div className="w-3 h-3 rounded-full bg-red-500"></div>

        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>

        <div className="w-3 h-3 rounded-full bg-green-500"></div>

      </div>

     

      <div className="space-y-3">

        <div className="h-3 bg-cyan-500 rounded w-3/4"></div>

        <div className="h-3 bg-slate-700 rounded w-full"></div>

        <div className="h-3 bg-slate-700 rounded w-4/5"></div>

        <div className="h-3 bg-purple-500 rounded w-2/3"></div>

        <div className="h-3 bg-slate-700 rounded w-full"></div>

      </div>

     

      <div className="mt-8 rounded-2xl bg-slate-800 p-5">

        <p className="text-cyan-400 font-semibold">
          🤖 AI Review
        </p>

        <p className="text-slate-300 mt-2 text-sm">
          Time Complexity Improved
        </p>

        <div className="mt-4 h-2 bg-slate-700 rounded">

          <div className="h-2 rounded bg-green-500 w-[85%]"></div>

        </div>

      </div>

    </div>

  </div>

 

  <div className="absolute -top-5 -left-5 bg-cyan-500 text-white px-4 py-2 rounded-xl shadow-xl animate-bounce">

    ⚡ Fast Judge

  </div>



  <div className="absolute bottom-5 -right-5 bg-purple-600 text-white px-4 py-2 rounded-xl shadow-xl animate-pulse">

    AI Powered

  </div>

</div>

  </div>

</section>
  );
}

export default Hero;