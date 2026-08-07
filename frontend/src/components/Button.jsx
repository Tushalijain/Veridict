function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  fullWidth = true,
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white hover:scale-[1.03] hover:shadow-[0_10px_35px_rgba(34,211,238,.35)]",

    secondary:
      "bg-slate-800 border border-slate-700 text-white hover:border-cyan-500",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${fullWidth ? "w-full" : ""}
        h-14
        px-6
        rounded-xl
        font-semibold
        text-lg
        transition-all
        duration-300
        flex
        items-center
        justify-center
        gap-2
        ${styles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;