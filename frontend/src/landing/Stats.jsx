function Stats() {
  const stats = [
    {
      title: "Problems",
      value: "150+",
      subtitle: "Coding Challenges",
      color: "from-cyan-500 to-blue-600",
      icon: "💻",
    },
    {
      title: "AI Reviews",
      value: "500+",
      subtitle: "Generated",
      color: "from-purple-500 to-pink-600",
      icon: "🤖",
    },
    {
      title: "Users",
      value: "1000+",
      subtitle: "Developers",
      color: "from-green-500 to-emerald-600",
      icon: "👨‍💻",
    },
    {
      title: "Accuracy",
      value: "99%",
      subtitle: "Judge Engine",
      color: "from-orange-500 to-red-500",
      icon: "⚡",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

        {stats.map((item) => (

          <div
            key={item.title}
            className="rounded-3xl bg-slate-900/70 border border-slate-800 p-8 hover:scale-105 transition-all duration-300 shadow-xl"
          >

            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl mb-6`}
            >
              {item.icon}
            </div>

            <h2 className="text-slate-400 text-lg">
              {item.title}
            </h2>

            <p className="text-5xl font-black text-white mt-2">
              {item.value}
            </p>

            <p className="text-slate-500 mt-2">
              {item.subtitle}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Stats;