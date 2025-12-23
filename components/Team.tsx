"use client";

import { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export default function Team() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const teamReveal = gsap.timeline({
      scrollTrigger: {
        trigger: ".team-section",
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    teamReveal.from(".gsap-title", {
      opacity: 0,
      y: -40,
      duration: 1,
      ease: "power3.out",
    });

    teamReveal.to(".gsap-card", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.2,
      delay: -0.5,
    });
  }, []);

  const teamMembers: TeamMember[] = [
    {
      name: "Emmanuel Brighton",
      role: "Founder & Product Visionary",
      image: "/img/emmanuelbrighton.jpg",
    },
    {
      name: "Nastasha Firdaus Khan",
      role: "Head of Ecosystem Growth & Partnerships",
      image: "/img/nastasha.jpg",
    },
    {
      name: "God'swill Akpan",
      role: "Co-founder & CMO",
      image: "/img/godswill.jpg",
    },
    {
      name: "Emmanuel Oluwafemi Joseph",
      role: "Co-founder & CTO",
      image: "/img/emmanueloluwafemi.jpg",
    },
  ];

  return (
    <section className="team-section">
      <h2 className="team-title gsap-title">Meet The Team</h2>

      <div className="team-container">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card gsap-card">
            <Image
              src={member.image}
              alt={`${member.name} Image`}
              width={260}
              height={240}
            />
            <div className="team-info">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
