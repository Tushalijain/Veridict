function Features() {
  const features = [
    {
      title: "Online Judge",
      description:
        "Fast, secure and accurate code execution with multiple language support.",
      icon: "⚡",
    },
    {
      title: "AI Code Review",
      description:
        "Receive detailed AI feedback, optimization tips and complexity analysis.",
      icon: "🤖",
    },
    {
      title: "Coding Contests",
      description:
        "Compete with developers worldwide and improve your ranking.",
      icon: "🏆",
    },
    {
      title: "Performance Analytics",
      description:
        "Track progress with detailed submission history and insights.",
      icon: "📊",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 py-24">

      <h2 className="text-5xl font-black text-center text-white">
        Why Choose
        <span className="text-cyan-400"> Veridict</span>?
      </h2>

      <p className="text-center text-slate-400 mt-5 max-w-2xl mx-auto">
        Everything you need to become better at competitive programming in one platform.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

        {features.map((item) => (

          <div
            key={item.title}
            className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 hover:-translate-y-3 hover:border-cyan-400 transition-all duration-300"
          >

            <div className="text-5xl mb-6">
              {item.icon}
            </div>

            <h3 className="text-2xl font-bold text-white">
              {item.title}
            </h3>

            <p className="text-slate-400 mt-4 leading-7">
              {item.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;