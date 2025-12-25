import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "../components/Marquee";
import CourseCard from "../components/CourseCard";
import { useTheme } from "../context";
import coursesApi from "../../services/api";
import type { Course } from "../../services/api";
import BentoGrid from "../components/BentoGrid";

gsap.registerPlugin(ScrollTrigger);

type CourseStatus = "Online" | "Offline" | "Hybrid";
type FilterType = CourseStatus | "All";

const Home: React.FC = () => {
  const { isDarkMode } = useTheme();
  const targetRef = useRef<HTMLDivElement>(null);
  const dossierRef = useRef<HTMLDivElement>(null);

  // State management
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("All");


  // Memoized filtered courses
  const filteredCourses = useMemo(() => {
    if (!Array.isArray(courses)) return [];
    if (filter === "All") return courses;
    return courses.filter((course) => course.status === filter);
  }, [courses, filter]);

  // Memoized filter handler
  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
  }, []);

  // Fetch courses from API
  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await coursesApi.getAllCourses({
          sort: "-createdAt",
          limit: 6,
        });

        if (isMounted) {
          setCourses(data);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Failed to fetch courses";
          setError(errorMessage);
          console.error("Error fetching courses:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP animations - optimized with proper cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const reveals = document.querySelectorAll(".reveal");

        reveals.forEach((el) => {
          ScrollTrigger.create({
            trigger: el as HTMLElement,
            start: "top 85%",
            onEnter: () => el.classList.add("active"),
            once: true, // Changed to true for better performance
          });
        });

        gsap.from(".edu-header", {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power4.out",
        });
      });

      return () => ctx.revert();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const filterButtons: FilterType[] = ["All", "Online", "Offline", "Hybrid"];

  return (
    <div className="relative" ref={targetRef}>
      {/* Background Layer */}
      <div
        className={`fixed inset-0 blueprint-grid pointer-events-none -z-20 transition-colors duration-700 ${isDarkMode ? "text-zinc-800 opacity-40" : "text-zinc-300 opacity-50"
          }`}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-16 px-6 lg:px-24 overflow-hidden">
        {/* Animated Background Glows */}
        {isDarkMode ? (
          <>
            <div className="absolute top-20 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none animate-float" />
            <div
              className="absolute bottom-20 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none"
              style={{ animation: "float 8s ease-in-out infinite reverse" }}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
          </>
        ) : (
          <>
            <div className="absolute top-20 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-200/30 blur-[120px] rounded-full pointer-events-none animate-float" />
            <div
              className="absolute bottom-20 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-rose-200/30 blur-[120px] rounded-full pointer-events-none"
              style={{ animation: "float 8s ease-in-out infinite reverse" }}
            />
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10 relative">
          <div className="lg:col-span-8">
            <h1 className="text-[11vw] lg:text-[9vw] font-black font-syne leading-[0.8] tracking-tighter uppercase  mb-12">
              <span className="block edu-header">Master</span>
              <span
                className={`block edu-header text-outline transition-colors ${isDarkMode ? "text-white/20" : "text-black/10"
                  }`}
                style={{
                  WebkitTextStroke: isDarkMode
                    ? "2px rgba(255, 255, 255, 0.2)"
                    : "2px rgba(0, 0, 0, 0.1)",
                }}
              >
                The Future
              </span>
              <span className="block edu-header">Syllabus.</span>
            </h1>

            <div className="max-w-2xl edu-header">
              <p
                className={`text-xl lg:text-2xl font-medium leading-relaxed mb-12 transition-colors ${isDarkMode ? "text-zinc-100" : "text-zinc-800"
                  }`}
              >
                A vocational powerhouse for engineers seeking{" "}
                <span
                  className={` font-bold ${isDarkMode ? "text-accent-cyan" : "text-blue-600"
                    }`}
                >
                  pedagogical excellence
                </span>{" "}
                and job-ready instincts. Beyond theory, we build legacy systems.
              </p>
              <div className="flex flex-wrap gap-6">
                <Link
                  to="/courses"
                  className={`px-12 py-6 font-black text-xl rounded-[2rem] hover:-translate-y-1 hover:shadow-2xl transition-all uppercase tracking-tighter shadow-lg ${isDarkMode
                    ? "bg-white text-black hover:bg-zinc-100"
                    : "bg-black text-white hover:bg-zinc-900"
                    }`}
                >
                  Access Curriculum
                </Link>
                <button
                  className={`px-12 py-6 border-2 font-black text-xl rounded-[2rem] transition-all uppercase tracking-tighter ${isDarkMode
                    ? "border-zinc-700 text-zinc-100 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                    : "border-zinc-300 text-zinc-900 hover:bg-emerald-500/10 hover:border-emerald-500/50"
                    }`}
                >
                  Student Portal
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block -mt-100">
            <div className="relative w-full aspect-square flex items-center justify-center animate-float">
              {/* Outer rotating ring */}
              <div
                className={`absolute inset-0 border-2 border-dashed rounded-full animate-spin-slow transition-colors ${isDarkMode ? "border-zinc-700" : "border-zinc-300"
                  }`}
              />

              {/* Middle rotating ring */}
              <div
                className={`absolute inset-12 border rounded-full animate-reverse-spin opacity-50 transition-colors ${isDarkMode ? "border-zinc-500" : "border-zinc-400"
                  }`}
              />

              {/* Center card */}
              <div
                className={`w-3/4 h-3/4 rounded-full flex items-center justify-center backdrop-blur-3xl overflow-hidden relative shadow-2xl border transition-all ${isDarkMode
                  ? "bg-zinc-900/80 border-zinc-800"
                  : "bg-white/90 border-zinc-200"
                  }`}
                style={
                  isDarkMode
                    ? {
                      boxShadow:
                        "0 0 60px -15px rgba(6, 182, 212, 0.3), 0 0 30px -10px rgba(217, 70, 239, 0.2), inset 0 0 40px -15px rgba(6, 182, 212, 0.1)",
                    }
                    : {}
                }
              >
                {/* Gradient overlay */}
                <div
                  className={`absolute inset-0 animate-pulse ${isDarkMode
                    ? "bg-gradient-to-br from-accent-cyan/20 to-accent-fuchsia/20"
                    : "bg-gradient-to-br from-emerald-500/10 to-blue-500/10"
                    }`}
                />

                {/* Content */}
                <div className="z-10 text-center font-mono relative">
                  <div
                    className={`text-[10px] tracking-widest uppercase font-bold transition-colors ${isDarkMode ? "text-zinc-300" : "text-zinc-600"
                      }`}
                  >
                    Learn. Build. Success.
                  </div>

                  {/* Decorative elements */}
                  <div
                    className={`absolute -top-8 -right-8 w-16 h-16 border-2 border-dashed rounded-full ${isDarkMode ? "border-cyan-500/30" : "border-blue-500/30"
                      }`}
                  />
                  <div
                    className={`absolute -bottom-8 -left-8 w-16 h-16 border-2 border-dashed rounded-full ${isDarkMode
                      ? "border-fuchsia-500/30"
                      : "border-rose-500/30"
                      }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating accent elements */}
        <div
          className={`absolute bottom-32 right-12 hidden xl:block w-4 h-4 rounded-full ${isDarkMode ? "bg-cyan-500" : "bg-blue-600"
            }`}
          style={{ animation: "float 4s ease-in-out infinite" }}
        />
        <div
          className={`absolute top-48 left-24 hidden xl:block w-3 h-3 rounded-full ${isDarkMode ? "bg-fuchsia-500" : "bg-rose-500"
            }`}
          style={{ animation: "float 5s ease-in-out infinite reverse" }}
        />
      </section>

      {/* Motivational Stream - REDUCED HEIGHT */}
      <div
        className={`relative z-20 py-8 origin-left overflow-hidden border-y ${isDarkMode ? "text-white" : "text-white"
          }`}
      >
        <Marquee />
      </div>

      {/* Philosophy Bento Grid */}
      <section className="py-25 px-6 md:px-12 relative overflow-hidden">
        {/* Background animated glows */}
        {isDarkMode ? (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none animate-float" />
            <div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"
              style={{ animation: "float 8s ease-in-out infinite reverse" }}
            />
          </>
        ) : (
          <>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/30 blur-[120px] rounded-full pointer-events-none animate-float" />
            <div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-200/30 blur-[120px] rounded-full pointer-events-none"
              style={{ animation: "float 8s ease-in-out infinite reverse" }}
            />
          </>
        )}

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Content - Sticky */}
            <div className="lg:col-span-5 sticky top-32 reveal">
              {/* Main Heading */}
              <h2
                className={`text-5xl md:text-8xl font-black font-syne tracking-tighter uppercase leading-[0.85] mb-12 ${isDarkMode ? "text-white" : "text-black"
                  }`}
              >
                Don't <br />
                Study <br />
                <span
                  className={`text-outline ${isDarkMode ? "text-rose-500" : "text-rose-500"
                    }`}
                  style={{
                    WebkitTextStroke: isDarkMode
                      ? "2px rgba(255, 255, 255, 0.2)"
                      : "2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  History.
                </span>{" "}
                <br />
                <span className="text-rose-500">Make It.</span>
              </h2>

              {/* Quote Card */}
              <div
                className={`p-8 md:p-10 rounded-[2.5rem] border-l-4 mb-12 relative overflow-hidden transition-all ${isDarkMode
                  ? "bg-zinc-900/60 border-cyan-500 backdrop-blur-xl"
                  : "bg-zinc-50 border-black shadow-lg"
                  }`}
              >
                {isDarkMode && (
                  <>
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-500/20" />
                    <div
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(6, 182, 212, 0.3) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </>
                )}
                <p
                  className={`text-xl md:text-2xl font-bold  leading-relaxed mb-4 ${isDarkMode ? "text-zinc-100" : "text-zinc-800"
                    }`}
                >
                  "The best way to predict the future is to invent it."
                </p>
                <cite
                  className={`block font-mono text-xs uppercase tracking-widest ${isDarkMode ? "text-zinc-500" : "text-zinc-400"
                    }`}
                >
                  — Alan Kay
                </cite>
              </div>

              {/* Description */}
              <p
                className={`text-xl font-medium leading-relaxed transition-colors ${isDarkMode ? "text-zinc-100" : "text-zinc-800"
                  }`}
              >
                WorknAi is a startup academy. We aren't here to give you a
                certificate for things everyone already knows. We are here to
                train the{" "}
                <span
                  className={`font-bold  ${isDarkMode ? "text-cyan-400" : "text-blue-600"
                    }`}
                >
                  Founding 100
                </span>{" "}
                to build what comes next.
              </p>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-zinc-500/10">
                <div className="space-y-2">
                  <div
                    className={`text-3xl md:text-4xl font-black font-syne ${isDarkMode ? "text-white" : "text-black"
                      }`}
                  >
                    100
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Founding Members
                  </p>
                </div>
                <div className="space-y-2">
                  <div
                    className={`text-3xl md:text-4xl font-black font-syne ${isDarkMode ? "text-white" : "text-black"
                      }`}
                  >
                    0→1
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Build Mindset
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - BentoGrid */}
            <div className="lg:col-span-7">
              <BentoGrid />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section
        id="courses"
        className="py-20 px-6 md:px-12 bg-transparent relative"
      >
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-10 reveal">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-8xl font-black leading-[0.8] tracking-tighter uppercase ">
                Courses Offered
              </h2>
            </div>

            <div
              className={`p-2 flex rounded-3xl border transition-all ${isDarkMode
                ? "bg-zinc-900/50 border-zinc-800"
                : "bg-zinc-100 border-zinc-200"
                }`}
            >
              {filterButtons.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat)}
                  className={`px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${filter === cat
                    ? isDarkMode
                      ? "bg-cyan-500 text-white shadow-xl shadow-cyan-900/40"
                      : "bg-black text-white shadow-xl"
                    : "hover:text-cyan-500"
                    }`}
                >
                  {cat === "All" ? "All Tracks" : `${cat} Mode`}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div
                  className={`animate-spin rounded-full h-16 w-16 border-t-4 mx-auto mb-4 ${isDarkMode ? "border-cyan-500" : "border-black"
                    }`}
                />
                <p
                  className={`text-xl font-semibold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                >
                  Loading courses...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-red-500 text-xl mb-4">Error: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className={`px-6 py-3 rounded-xl font-bold transition-colors ${isDarkMode
                    ? "bg-cyan-600 text-white hover:bg-cyan-700"
                    : "bg-black text-white hover:bg-zinc-800"
                    }`}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p
                    className={`text-2xl font-semibold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"
                      }`}
                  >
                    No courses found for this category.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* View All Courses Link */}
          {!loading && !error && courses.length > 0 && (
            <div className="flex justify-center mt-16">
              <Link
                to="/courses"
                className={`px-12 py-6 rounded-[2rem] font-black text-lg uppercase tracking-tighter transition-all hover:-translate-y-1 hover:shadow-2xl ${isDarkMode
                  ? "bg-cyan-500 text-white hover:bg-cyan-400"
                  : "bg-black text-white hover:bg-zinc-800"
                  }`}
              >
                View All Courses
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* WHY JOIN US Section */}
      <section
        ref={dossierRef}
        className="pt-10 py-20 md:py-32 lg:py-40 px-6 lg:px-24"
      >
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-20 md:mb-32 reveal">
            <h2
              className={`text-5xl md:text-7xl lg:text-[7rem] font-black font-syne tracking-tighter  leading-[0.75] ${isDarkMode ? "text-white" : "text-black"
                }`}
            >
              Why<span className="text-rose-500">Join</span> Us.
            </h2>
          </div>

          {/* Three Pillars Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {/* Pillar 01 */}
            <div
              className={`reveal group p-8 md:p-12 border rounded-sm flex flex-col justify-between transition-all duration-500 min-h-[400px] ${isDarkMode
                ? "bg-blue-600 text-white border-blue-600 shadow-2xl hover:bg-blue-500"
                : "bg-blue-600 text-white border-blue-600 shadow-2xl hover:bg-blue-500"
                }`}
            >
              <div>
                <div className="flex justify-between items-start mb-16 md:mb-24">
                  <div className="text-5xl md:text-6xl font-black font-syne  opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    01
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-4xl font-black font-syne tracking-tighter leading-none mb-8 md:mb-10">
                  Deep <br /> Protocol.
                </h3>
                <p className="text-base md:text-lg lg:text-xl leading-snug mb-8 md:mb-12 opacity-90">
                  We don't teach syntax. We teach the{" "}
                  <span className="underline decoration-2 underline-offset-4 font-black">
                    concurrency, latency, and hardware
                  </span>{" "}
                  logic that defines the next decade of software.
                </p>
              </div>
              <div className="h-1 w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 bg-white" />
            </div>

            {/* Pillar 02 */}
            <div
              className={`reveal group p-8 md:p-12 border rounded-sm flex flex-col justify-between transition-all duration-500 min-h-[400px] ${isDarkMode
                ? "bg-rose-600 text-white border-rose-600 shadow-2xl hover:bg-rose-500"
                : "bg-rose-600 text-white border-rose-600 shadow-2xl hover:bg-rose-500"
                }`}
            >
              <div>
                <div className="flex justify-between items-start mb-16 md:mb-24">
                  <div className="text-5xl md:text-6xl font-black font-syne  opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    02
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-4xl font-black font-syne tracking-tighter leading-none mb-8 md:mb-10">
                  Raw <br /> Labware.
                </h3>
                <p className="text-base md:text-lg lg:text-xl leading-snug mb-8 md:mb-12 opacity-90">
                  Direct access to{" "}
                  <span className="underline decoration-2 underline-offset-4 font-black">
                    production-scale infrastructure.
                  </span>{" "}
                  No sandboxes, no hand-holding. If it compiles, it ships.
                </p>
              </div>
              <div className="h-1 w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 bg-white" />
            </div>

            {/* Pillar 03 */}
            <div
              className={`reveal group p-8 md:p-12 border rounded-sm flex flex-col justify-between transition-all duration-500 min-h-[400px] ${isDarkMode
                ? "bg-accent-cyan text-white border-accent-cyan shadow-2xl"
                : "bg-black text-white border-black shadow-2xl"
                }`}
            >
              <div>
                <div className="flex justify-between items-start mb-16 md:mb-24">
                  <div className="text-5xl md:text-6xl font-black font-syne opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                    03
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl lg:text-4xl font-black font-syne tracking-tighter leading-none mb-8 md:mb-10">
                  The <br /> Network.
                </h3>
                <p className="text-base md:text-lg lg:text-xl leading-snug mb-8 md:mb-12 opacity-90">
                  The first 100 aren't students—they are{" "}
                  <span className="underline decoration-2 underline-offset-4 font-black">
                    stakeholders.
                  </span>{" "}
                  You define the DNA of the community.
                </p>
              </div>
              <div className="h-1 w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 bg-white" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-30 px-6">
        <div
          className={`max-w-[1600px] mx-auto rounded-[5rem] overflow-hidden relative group py-20 px-12 text-center reveal border-4 transition-all ${isDarkMode
            ? "bg-black border-cyan-500 shadow-[0_0_80px_rgba(6,182,212,0.15)]"
            : "bg-black border-white text-white"
            }`}
        >
          {/* RGB Background Stripes */}
          <div
            className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isDarkMode
              ? "from-cyan-400 via-blue-500 to-fuchsia-500"
              : "from-rose-500 via-emerald-500 to-blue-500"
              }`}
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black font-syne mb-10 tracking-tighter leading-none  uppercase">
              Ready to Transform <br /> Your Potential?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                to="/signup"
                className={`px-12 py-6 rounded-[2.5rem] font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl ${isDarkMode
                  ? "bg-cyan-500 text-white hover:bg-cyan-400"
                  : "bg-white text-black"
                  }`}
              >
                Enroll in Excellence
              </Link>
              <p className="text-xl font-medium opacity-60 max-w-xs text-left hidden md:block">
                Scholarships and early-bird grants valid for the current intake
                cycle.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;