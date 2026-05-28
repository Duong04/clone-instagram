import { motion } from "motion/react";

export const SplashScreen = () => {
  return (
    <>
      <motion.div
        key={location.pathname + "-progress"}
        initial={{ width: "0%", opacity: 1 }}
        animate={{ width: "100%", opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] z-[1000] pointer-events-none"
      />
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center"
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -inset-6 rounded-[32px] border-[1.5px] border-transparent bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] [mask-image:linear-gradient(white,white)_padding-box,linear-gradient(white,white)] [mask-composite:exclude] opacity-40"
            />

            <motion.div
              animate={{
                opacity: [0.1, 0.2, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full blur-3xl opacity-10"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-10"
            >
              <img
                src="/public/logo-favicon.png"
                alt="Instagram"
                className="w-20 h-20 drop-shadow-xl"
              />
            </motion.div>

            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                    className="w-1.5 h-1.5 bg-zinc-300 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pb-12 flex flex-col items-center gap-2">
          <p className="text-zinc-400 text-sm font-medium">from</p>
          <div className="flex items-center gap-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1280px-Meta_Platforms_Inc._logo.svg.png"
              alt="Meta"
              className="h-4 opacity-80"
            />
          </div>
        </div>
      </motion.div>
    </>
  );
};
