import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../src/context";
import { motion, AnimatePresence } from "framer-motion";
import coursesApi from "../../services/api";
import type { CourseDetail, TechnicalSpec, SyllabusPhase } from "../../services/api";

// Constants
const DEFAULT_CERTIFICATE_IMAGE = "Certificate Copy.jpeg";
const WEEKS_PER_PHASE = 4;

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, delay: 0.2 }
};

const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, delay: 0.4 }
};

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activePhase, setActivePhase] = useState<number>(0);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch course data with cleanup
  useEffect(() => {
    let isMounted = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Course ID is required");
        }

        const data = await coursesApi.getCourseById(id);

        if (!isMounted) return;

        setCourse(data);
      } catch (err) {
        if (!isMounted) return;

        console.error("Error fetching course:", err);
        const errorMessage = err instanceof Error
          ? err.message
          : "Failed to load course data. Please try again later.";
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchCourse();
    } else {
      setError("Course ID is missing");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Memoized handlers
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleBackToCourses = useCallback(() => {
    navigate("/courses");
  }, [navigate]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!imageError) {
      e.currentTarget.src = DEFAULT_CERTIFICATE_IMAGE;
      setImageError(true);
    }
  }, [imageError]);

  const handleReserveSlot = useCallback(() => {
    // Add reservation logic here
    console.log("Reserve slot clicked for course:", course?.name);
  }, [course]);

  // Memoized calculations
  const discountPercent = useMemo(() => {
    if (!course) return 0;
    return Math.round(
      ((course.originalPrice - course.discountedPrice) / course.originalPrice) * 100
    );
  }, [course]);

  const technicalSpecs = useMemo((): TechnicalSpec[] => {
    if (!course) return [];

    return course.technicalSpecs || [
      {
        label: "Duration",
        value: `${course.syllabusPhases?.length || 6} Months`,
        icon: "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
      },
      {
        label: "Mode",
        value: course.status,
        icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25",
      },
      {
        label: "Language",
        value: course.language,
        icon: "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802",
      },
    ];
  }, [course]);

  const syllabusPhases = useMemo((): SyllabusPhase[] => {
    return course?.syllabusPhases || [];
  }, [course]);

  const totalWeeks = useMemo(() => {
    return syllabusPhases.length * WEEKS_PER_PHASE;
  }, [syllabusPhases]);

  // Split course name for styling
  const courseNameParts = useMemo(() => {
    if (!course) return [];
    return course.name.split(" ");
  }, [course]);

  // Loading state
  if (loading) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${isDarkMode ? "bg-zinc-950" : "bg-white"
          }`}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p
            className={`font-syne font-black text-xl uppercase tracking-wider ${isDarkMode ? "text-white" : "text-zinc-900"
              }`}
          >
            Loading Course Data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={`h-screen flex items-center justify-center ${isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
          }`}
      >
        <div className="text-center space-y-4 px-6 max-w-2xl">
          <p className="font-syne font-black text-4xl text-rose-500">
            ERROR
          </p>
          <p className="text-xl">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${isDarkMode ? "bg-white text-black" : "bg-black text-white"
                }`}
            >
              Retry
            </button>
            <button
              onClick={handleBackToCourses}
              className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${isDarkMode
                  ? "bg-zinc-800 text-white hover:bg-zinc-700"
                  : "bg-zinc-100 text-black hover:bg-zinc-200"
                }`}
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Course not found state
  if (!course) {
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center font-syne font-black text-4xl ${isDarkMode ? "text-white" : "text-zinc-900"
          }`}
      >
        <p className="mb-8">COURSE_NOT_FOUND</p>
        <button
          onClick={handleBackToCourses}
          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 ${isDarkMode
              ? "bg-zinc-800 text-white hover:bg-zinc-700"
              : "bg-zinc-100 text-black hover:bg-zinc-200"
            }`}
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen -mt-10 transition-colors duration-500 overflow-x-hidden ${isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-900"
        }`}
    >
      {/* HERO SECTION */}
      <section className="relative pt-24 lg:pt-48 px-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div {...fadeInUp} className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.3em] border shadow-sm ${isDarkMode
                      ? "bg-zinc-900 border-white/10 text-cyan-400"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600"
                    }`}
                >
                  {course.status}
                </span>
                <div className="hidden sm:block h-[1px] w-12 bg-zinc-500/20" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  {course.language}
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[5rem] font-bold font-inter tracking-tighter leading-[0.85]">
                {courseNameParts.map((word, i) => (
                  <span
                    key={`word-${i}`}
                    className={`${i === 0
                        ? isDarkMode
                          ? "text-cyan-400"
                          : "text-blue-600"
                        : "text-zinc-500/50"
                      } ${i > 0 ? "block lg:inline lg:ml-4" : ""}`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
            </motion.div>

            <motion.div
              {...scaleIn}
              className={`p-8 lg:p-12 rounded-[3.5rem] border-l-8 relative overflow-hidden group ${isDarkMode
                  ? "bg-zinc-900/40 border-cyan-500 shadow-2xl"
                  : "bg-zinc-50 border-black shadow-lg shadow-zinc-200"
                }`}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5" aria-hidden="true">
                <svg
                  className="w-32 h-32"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <p className="text-xl md:text-3xl font-light leading-relaxed max-w-2xl relative z-10">
                "{course.description}"
              </p>
              <div className="mt-10 flex flex-wrap gap-4 relative z-10">
                <button
                  onClick={handleReserveSlot}
                  className={`px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform hover:-translate-y-1 active:scale-95 shadow-2xl ${isDarkMode
                      ? "bg-white text-black hover:bg-cyan-400"
                      : "bg-black text-white hover:bg-blue-600"
                    }`}
                >
                  Initialize Career Track
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Technical Specs */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              {...slideInRight}
              className={`p-10 rounded-[3rem] border shadow-2xl relative overflow-hidden ${isDarkMode
                  ? "bg-zinc-900/60 border-white/5"
                  : "bg-white border-black/5 shadow-zinc-200"
                }`}
            >
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-10 border-b border-zinc-500/10 pb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                Technical Telemetry
              </h5>
              <div className="space-y-10">
                {technicalSpecs.map((spec, i) => (
                  <div key={`spec-${i}`} className="flex items-center gap-6 group">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${isDarkMode
                          ? "bg-zinc-950 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black"
                          : "bg-zinc-100 text-blue-600 group-hover:bg-black group-hover:text-white"
                        }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={spec.icon}
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                        {spec.label}
                      </p>
                      <p className="text-lg font-bold font-inter tracking-tighter uppercase break-words">
                        {spec.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICE SECTION */}
      <section className="mt-16 px-6 max-w-[1600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-6 md:p-10 rounded-[3.5rem] border-2 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden ${isDarkMode
              ? "bg-zinc-900 border-white/5 shadow-black/50"
              : "bg-white border-zinc-100 shadow-zinc-300/30"
            }`}
        >
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />

          <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-16 px-4 md:px-8 relative z-10">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                Course Fees
              </span>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl md:text-6xl font-bold font-inter tracking-tighter">
                  ₹{course.discountedPrice.toLocaleString("en-IN")}
                </span>
                {course.originalPrice !== course.discountedPrice && (
                  <span className="text-sm line-through opacity-20">
                    ₹{course.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {discountPercent > 0 && (
              <>
                <div className="hidden lg:block h-16 w-[2px] bg-zinc-500/10" />
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest">
                      {discountPercent}% DISCOUNT APPLIED
                    </span>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-center relative z-10">
            <button
              onClick={handleReserveSlot}
              className={`px-10 md:px-14 py-5 md:py-7 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-5 transition-all transform hover:scale-105 active:scale-95 ${isDarkMode ? "bg-white text-black" : "bg-black text-white"
                }`}
            >
              Reserve Slot
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      </section>

      {/* SYLLABUS SECTION */}
      {syllabusPhases.length > 0 && (
        <section className="py-20 md:py-24 px-6 max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-24 gap-12">
            <div className="space-y-4">
              <span
                className={`text-[11px] font-black uppercase tracking-[0.5em] ${isDarkMode ? "text-cyan-400" : "text-blue-600"
                  }`}
              >
                The Learning Path
              </span>
              <h2 className="text-6xl md:text-[6rem] font-black font-light tracking-tighter leading-none">
                Curriculum.
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs ml-1">
                {totalWeeks} Weeks of Technical Immersion
              </p>
            </div>

            <div className="hidden lg:block h-[1px] flex-grow bg-zinc-500/10 mx-10" />

            <div className="flex items-center gap-6">
              <div className="text-left lg:text-right">
                <p className="text-3xl font-black font-syne leading-none">
                  {syllabusPhases.length}{" "}
                  {syllabusPhases.length === 1 ? "Month" : "Months"}
                </p>
                <p className="text-[9px] font-bold uppercase text-zinc-500 tracking-widest mt-1">
                  Execution Cycle
                </p>
              </div>
            </div>
          </div>

          {/* Phase Headers */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
            {syllabusPhases.map((phase, i) => (
              <button
                key={`phase-${i}`}
                onClick={() => setActivePhase(i)}
                className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-700 relative group overflow-hidden ${activePhase === i
                    ? isDarkMode
                      ? "bg-cyan-500 border-cyan-400 text-white shadow-2xl"
                      : "bg-black border-black text-white shadow-2xl shadow-black/20"
                    : isDarkMode
                      ? "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white"
                      : "bg-white border-zinc-100 text-zinc-400 hover:border-black shadow-sm"
                  }`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10" aria-hidden="true">
                  <span className="text-3xl font-black font-syne">
                    M{i + 1}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.5em] block mb-2 transition-colors ${activePhase === i ? "text-white/60" : "text-zinc-500"
                    }`}
                >
                  PHASE_0{i + 1}
                </span>
                <h4 className="text-base font-bold font-inter tracking-tight leading-none uppercase">
                  {phase.month}
                </h4>
                <div
                  className={`h-1 w-0 mt-4 transition-all duration-1000 group-hover:w-16 ${activePhase === i ? "bg-white w-20" : "bg-zinc-500/20"
                    }`}
                />
              </button>
            ))}
          </div>

          {/* Phase Content */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full p-10 md:p-20 rounded-[4.5rem] border-4 overflow-hidden relative shadow-2xl ${isDarkMode
                    ? "bg-zinc-900 border-zinc-800"
                    : "bg-white border-zinc-100 shadow-zinc-300/20"
                  }`}
              >
                <div className="absolute top-10 left-10 flex gap-2" aria-hidden="true">
                  <div className="w-3 h-3 rounded-full bg-rose-500/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start relative z-10">
                  <div className="lg:col-span-4 space-y-12">
                    <div className="space-y-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? "text-cyan-400" : "text-blue-600"
                          }`}
                      >
                        Monthly Objective
                      </span>
                      <h3 className="text-4xl md:text-5xl font-black font-syne font-light tracking-tighter leading-tight">
                        {syllabusPhases[activePhase].title}
                      </h3>
                    </div>
                    <p className="text-xl text-zinc-500 font-medium leading-relaxed border-l-4 border-zinc-500/10 pl-10 max-w-sm">
                      "{syllabusPhases[activePhase].desc}"
                    </p>
                  </div>

                  <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {syllabusPhases[activePhase].weeks.map((week, j) => (
                        <motion.div
                          key={`week-${j}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.1 }}
                          className={`p-8 rounded-[2.5rem] border border-zinc-500/10 hover:border-cyan-500/20 transition-all group ${isDarkMode ? "bg-zinc-950/30" : "bg-zinc-50/50"
                            }`}
                        >
                          <div className="flex items-center gap-4 border-b border-dashed border-zinc-500/10 pb-5 mb-5">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black font-syne shrink-0 ${isDarkMode
                                  ? "bg-cyan-500 text-black"
                                  : "bg-black text-white"
                                }`}
                            >
                              {week.label.slice(-1)}
                            </div>
                            <h5 className="text-base font-bold tracking-tight uppercase group-hover:translate-x-1 transition-transform">
                              {week.title}
                            </h5>
                          </div>
                          <ul className="space-y-3">
                            {week.topics.map((topic, k) => (
                              <li
                                key={`topic-${k}`}
                                className="flex items-start gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-wider transition-colors"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 mt-1.5 shrink-0" />
                                <span className="flex-1">{topic.name}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* CERTIFICATE SECTION */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] blur-[200px] opacity-20 pointer-events-none ${isDarkMode ? "bg-cyan-500" : "bg-blue-100"
            }`}
        />

        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center">
          <div className="text-center space-y-10 mb-24 w-full">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl lg:text-[5rem] font-black font-syne font-light tracking-tighter leading-none cursor-default"
            >
              Verified Certificates.
            </motion.h2>

            <p className="text-lg md:text-xl text-zinc-500 font-medium leading-relaxed mx-auto max-w-4xl border-t border-zinc-500/10 pt-10 px-4">
              Your mastery is quantified and logged in the WorknAI global
              ledger. Every graduate receives a secure industrial authority
              token verified across our corporate partner network.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full">
            {/* Left Side Tags */}
            <div className="lg:col-span-3 space-y-6 hidden lg:block">
              {[
                "ISO 9001:2015 Verified",
                "Audited Curricula",
                "LinkedIn",
              ].map((tag, i) => (
                <div
                  key={`left-tag-${i}`}
                  className={`p-8 rounded-[2.5rem] border text-center transition-all duration-500 hover:scale-110 hover:-rotate-1 ${isDarkMode
                      ? "bg-zinc-900/50 border-white/5 shadow-2xl shadow-cyan-950/20"
                      : "bg-white border-zinc-100 shadow-xl"
                    }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {tag}
                  </p>
                </div>
              ))}
            </div>

            {/* Certificate Image */}
            <div className="lg:col-span-6 relative group">
              <div className="absolute -inset-20 bg-cyan-500/10 blur-[180px] opacity-0 group-hover:opacity-100 transition-all duration-1000" />

              <div
                className={`relative aspect-[1.4/1] rounded-[3.5rem] p-1.5 shadow-2xl overflow-hidden ${isDarkMode
                    ? "bg-zinc-800 border-white/10"
                    : "bg-zinc-200 border-black/5 shadow-zinc-300"
                  }`}
              >
                <div
                  className={`w-full h-full rounded-[3.2rem] overflow-hidden relative ${isDarkMode ? "bg-zinc-950" : "bg-white"
                    }`}
                >
                  <img
                    src={course.certificateImage || DEFAULT_CERTIFICATE_IMAGE}
                    alt="WorknAI Official Certificate"
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 opacity-60" />
                </div>
              </div>
            </div>

            {/* Right Side Tags */}
            <div className="lg:col-span-3 space-y-6 hidden lg:block">
              {[
                "Verifiable Ledger",
                "Industry Priority Key",
                "Global Security ID",
              ].map((tag, i) => (
                <div
                  key={`right-tag-${i}`}
                  className={`p-8 rounded-[2.5rem] border text-center transition-all duration-500 hover:scale-110 hover:rotate-1 ${isDarkMode
                      ? "bg-zinc-900/50 border-white/5 shadow-2xl shadow-cyan-950/20"
                      : "bg-white border-zinc-100 shadow-xl"
                    }`}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {tag}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetailPage;