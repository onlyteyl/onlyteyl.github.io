
window.ComsocData = (function () {

  const mainOfficers = [
    { role: 'President', name: 'TBD', bio: 'Leads the organization\'s strategic direction, represents COMSOC in university affairs, and oversees the execution of all major programs and initiatives.', icon: 'fa-crown', img: 'assets/officers/president1.jpg' },
    { role: 'Vice President — Internal', name: 'TBD', bio: 'Oversees internal affairs, member engagement, and the day-to-day coordination of committees and general assembly matters.', icon: 'fa-users-gear', img: 'assets/officers/vp-internal.jpg' },
    { role: 'Vice President — External', name: 'TBD', bio: 'Manages partnerships, sponsorships, and the organization\'s relationships with industry partners and allied institutions.', icon: 'fa-handshake', img: 'assets/officers/vp-external.jpg' },
    { role: 'Secretary', name: 'TBD', bio: 'Maintains official records, documentation, and communications, ensuring transparency across all organizational proceedings.', icon: 'fa-file-signature', img: 'assets/officers/secretary.jpg' },
    { role: 'Treasurer', name: 'TBD', bio: 'Manages the organization\'s finances, budgeting, and fund allocation for programs, events, and operational needs.', icon: 'fa-sack-dollar', img: 'assets/officers/treasurer.jpg' },
  ];

  const advisers = [
    {
      role: 'Faculty Adviser',
      name: 'Dr. Melani Castillo',
      bio: 'Serves as the organization’s Faculty Adviser while mentoring students in capstone projects, guiding them in research, system development, and the successful completion of their academic requirements.',
      img: 'assets/advisers/castillo.png'
    },
    {
      role: 'IT Professor',
      name: 'Christopher Jay De Claro',
      bio: 'Mentors students in strengthening their technical knowledge and encourages innovation through practical learning, collaboration, and industry-relevant skills.',
      img: 'assets/advisers/De-claro.png'
    },
    {
      role: 'IT Professor',
      name: 'Dr. Marienel Velasco',
      bio: 'Supports student development by fostering academic excellence, critical thinking, and active participation in technology-driven programs and research.',
      img: 'assets/advisers/velasco.png'
    },
    {
      role: 'IT Professor',
      name: 'Aris Dela Rea',
      bio: 'Specializes in cybersecurity and information security, helping students develop secure systems while promoting best practices in protecting digital information.',
      img: 'assets/advisers/Dela-rea.png'
    },
    {
      role: 'IT Professor',
      name: 'Elaine Bolambot',
      bio: 'Guides students throughout their capstone journey by providing mentorship in research, project planning, system implementation, and technical documentation.',
      img: 'assets/advisers/bolambot.png'
    },
    {
      role: 'IT Professor',
      name: 'Joshua Madera',
      bio: 'Promotes innovation, problem-solving, and collaborative learning by mentoring students in emerging technologies and real-world IT practices.',
      img: 'assets/advisers/madera.png'
    }
  ];


  const committees = [
    { name: 'Publication Committee', icon: 'fa-newspaper', desc: 'Produces official publications, articles, newsletters, and written content that keep members informed about organization activities.', headName: 'TBD', headBio: 'Leads the Publication Committee.', headImg: 'assets/officers/publication-head.jpg' },
    { name: 'Technical Committee', icon: 'fa-code', desc: 'Organizes coding workshops, technical trainings, hackathons, and provides technical support during organization events.', headName: 'TBD', headBio: 'Leads the Technical Committee.', headImg: 'assets/officers/technical-head.jpg' },
    { name: 'Documentation Committee', icon: 'fa-camera', desc: 'Captures photos and videos, documents activities, and preserves official records and event archives.', headName: 'TBD', headBio: 'Leads the Documentation Committee.', headImg: 'assets/officers/documentation-head.jpg' },
    { name: 'Sports Committee', icon: 'fa-volleyball', desc: 'Plans and manages sports events, tournaments, and recreational activities that promote teamwork and wellness.', headName: 'TBD', headBio: 'Leads the Sports Committee.', headImg: 'assets/officers/sports-head.jpg' },
    { name: 'Esports Committee', icon: 'fa-gamepad', desc: 'Handles esports tournaments, gaming events, and supports COMSOC competitive gaming initiatives.', headName: 'TBD', headBio: 'Leads the Esports Committee.', headImg: 'assets/officers/esports-head.jpg' },
    { name: 'Social Media Committee', icon: 'fa-hashtag', desc: 'Manages the organization\u2019s online presence by creating engaging content and promoting events across digital platforms.', headName: 'TBD', headBio: 'Leads the Social Media Committee.', headImg: 'assets/officers/socmed-head.jpg' },
    { name: 'Design Committee', icon: 'fa-palette', desc: 'Creates branding materials, posters, graphics, and visual assets that represent the organization\u2019s identity.', headName: 'TBD', headBio: 'Leads the Design Committee.', headImg: 'assets/officers/design-head.jpg' },
    { name: 'Program Committee', icon: 'fa-calendar-check', desc: 'Plans event programs, prepares activity flow, coordinates hosts, and ensures the smooth execution of organization events.', headName: 'TBD', headBio: 'Leads the Program Committee.', headImg: 'assets/officers/program-head.jpg' },
    { name: 'Aftercare Committee', icon: 'fa-handshake-angle', desc: 'Monitors post-event activities, gathers feedback, recognizes volunteers, and ensures continuous member engagement after every program.', headName: 'TBD', headBio: 'Leads the Aftercare Committee.', headImg: 'assets/officers/aftercare-head.jpg' },
  ];

  const news = [

    {
      tag: 'Feature',
      date: ' May 31, 2025',
      image: 'assets/news/news4.jpg',
      title: 'PUP-STC Computer Society Concludes Academic Year with Grand "404 ComSoc Not Found" Celebration',
      excerpt: "The Computer Society concluded Academic Year 2024–2025 with '404 ComSoc Not Found: The Grand ExIT & Year-End Celebration,' bringing together students and faculty to celebrate a successful year.",
      desc: `
<div class="article-content">

<p>The Polytechnic University of the Philippines – Sto. Tomas Campus (PUP-STC) Computer Society successfully concluded Academic Year 2024–2025 with its year-end celebration titled <strong>"404 ComSoc Not Found: The Grand ExIT & Year-End Celebration"</strong> on May 26, 2025.</p>

<p>Students attended the event wearing Y2K-inspired outfits, embracing the celebration's nostalgic theme and adding a vibrant atmosphere to the program.</p>

<p>The celebration brought together Computer Society members, student leaders, faculty advisers, and guests to recognize the organization's accomplishments, memorable events, and milestones achieved throughout the academic year.</p>

<p>Awards, recognition segments, interactive activities, and special performances highlighted the event, giving members the opportunity to reflect on the organization's journey while celebrating the dedication and contributions of its officers and members.</p>

<p>More than just a year-end gathering, the celebration served as a tribute to the commitment, teamwork, and passion that defined the Computer Society during Academic Year 2024–2025, while also looking forward to another year of innovation, leadership, and service.</p>

</div>
`,
    },
    {
      tag: 'Editorial',
      date: 'May 12, 2026',
      image: 'assets/news/news1.png',
      title: 'A Curriculum Without Consciousness',
      excerpt: 'The Commission on Higher Education (CHED) has proposed reducing college General Education (GE) units from 36 to 18-21. While it is presented as a step toward modernization, the proposal weakens one of the most important purposes of higher education: teaching students how to think critically through exposure to diverse fields of knowledge.',
      desc: `
      <p>The Commission on Higher Education (CHED) has proposed reducing college General Education (GE) units from 36 to 18-21. While it is presented as a step toward modernization, the proposal weakens one of the most important purposes of higher education: teaching students how to think critically through exposure to diverse fields of knowledge.</p>

      <p>General Education courses expose students to history, literature, philosophy, social sciences, and other disciplines beyond their chosen field. This diversity of learning teaches students how to analyze ideas, question information, understand different perspectives, and make informed judgments. Critical thinking does not develop in isolation. It grows when students engage with different experiences, cultures, beliefs, and social realities.</p>

      <p>These courses are even more important today. Misinformation spreads rapidly, historical facts are distorted online, and political division continues to deepen. Social media platforms often reward outrage, shallow thinking, and blind conformity instead of careful reflection and truth. In this environment, students need more opportunities to question, examine evidence, and understand the society around them.</p>

      <p>Modernization should not come at the expense of General Education courses. Progress in education should strengthen a student's understanding of culture, ethics, and society, not reduce it. Cutting GE units limits the space for students to reflect on the realities faced by ordinary Filipinos and understand the nation they belong to.</p>

      <p>Some argue that the Philippines gives too many GE courses compared to other countries that focus more on internships and specialization. But the Philippine experience is different. Our national identity remains complicated, shaped by colonial history, social inequality, and political division. Because of this, students need a stronger grounding in history, language, culture, and society. Nation-building begins with citizens who understand who they are, what country they belong to, and what they must strive for as part of the Inang Bayan.</p>

      <p>College should not only prepare students for employment. It should develop citizens capable of thinking for themselves. A country that weakens critical education does not move forward intellectually. It becomes easier to mislead, manipulate, and divide.</p>
    `,
    },
    {
      tag: 'Feature',
      date: 'Feb 25, 2026',
      image: 'assets/news/news2.png',
      title: 'The University President Who Refused to Bow: Nemesio Prudente and PUP in the Time of Martial Law',
      excerpt: 'When Nemesio Prudente took the helm of what was then the Philippine College of Commerce—now the Polytechnic University of the Philippines—he did not simply assume an administrative post. He stepped into a battlefield of ideas.',

      desc: `
          <div class="article-content">
          
            <p>When Nemesio Prudente took the helm of what was then the Philippine College of Commerce—now the Polytechnic University of the Philippines—he did not simply assume an administrative post. He stepped into a battlefield of ideas.</p>
          
            <p>In 1972, when Ferdinand Marcos declared Martial Law, universities across the country became sites of tension, surveillance, and resistance. Classrooms were no longer insulated from politics; they were entangled in it. And at PUP, Prudente stood firm in the belief that education could not—and should not—be divorced from the nation's struggle for democracy.</p>
          
            <h3>A Campus Under Watch</h3>
          
            <p>Martial Law sought to silence dissent. Student publications were monitored. Assemblies were curtailed. Activists were tagged, arrested, or forced underground. Like many institutions, PUP operated under the shadow of military oversight. Yet it also became known as a breeding ground for critical thought.</p>
          
            <p>Prudente's leadership shaped this identity. Rather than reducing the university to technical training alone, he championed a nationalist and socially responsive education. He emphasized that state universities bore a responsibility to the people—especially the marginalized sectors whose taxes sustained them. In a time when obedience was rewarded and questioning was dangerous, this philosophy was quietly radical.</p>
          
            <p>PUP students, many of whom came from working-class families, were acutely aware of the economic hardships that intensified during the dictatorship. Tuition hikes, labor issues, and human rights violations were not abstract debates; they were lived realities. The campus became a space where these concerns were discussed, organized, and, at times, protested.</p>
          
            <h3>Education as Resistance</h3>
          
            <p>Prudente believed that universities must produce graduates who were not only skilled but socially conscious. Under his watch, PUP cultivated an environment where discourse on national issues was not suppressed but engaged. Faculty members and students alike participated in conversations about sovereignty, corruption, and civil liberties.</p>
          
            <p>This stance came at a cost. Prudente himself faced political persecution for his activism and nationalist views. His presidency was disrupted during the dictatorship, and he endured detention. Yet his commitment to academic freedom and democratic ideals never wavered.</p>
          
            <p>In many ways, PUP's posture during Martial Law reflected its constituency. As a state university serving predominantly underprivileged students, it was deeply intertwined with the struggles of ordinary Filipinos. The institution did not merely observe history—it inhabited it.</p>
          
            <h3>Legacy of Courage</h3>
          
            <p>When the dictatorship ended in 1986 following the People Power Revolution, universities across the country reassessed their roles in the national narrative. At PUP, Prudente's leadership was remembered as a testament to principled governance in turbulent times.</p>
          
            <p>His legacy is not confined to administrative reforms or infrastructure projects. It lives in the culture of vigilance and engagement that continues to define the university. PUP's reputation as a hotbed of activism—sometimes criticized, often misunderstood—can be traced back to a period when speaking up required extraordinary courage.</p>
          
            <p>Today, discussions about academic freedom, state accountability, and civic responsibility still echo across its corridors. The questions remain familiar: What is the duty of a university in times of crisis? How should education respond when democracy is threatened?</p>
          
            <p>Nemesio Prudente answered these not with slogans, but with action. In the darkest chapter of Philippine political history, he insisted that a university must stand with its people—even when standing carried consequences.</p>
          
            <p>And in doing so, he helped shape PUP not just as an institution of learning, but as a community of conscience.</p>
          
          </div>
          `,
    },
    {
      tag: 'Announcement',
      date: 'Feb 09, 2026',
      image: 'assets/news/news3.jpg',
      title: 'A Campus of Refuge and Resolve: PUP Sto. Tomas During the 2020 Taal Volcano Eruption',
      excerpt: 'As the Polytechnic University of the Philippines (PUP) Sto. Tomas Campus marks its 34th founding anniversary, the celebration is not only a remembrance of years passed, but also a tribute to moments when the campus stood firm in service of the people. One such defining moment unfolded on January 12, 2020, when Taal Volcano erupted, displacing thousands of Batangueños and altering lives in a matter of hours.',
      desc: `
          <div class="article-content">
          
            <p>As the Polytechnic University of the Philippines (PUP) Sto. Tomas Campus marks its 34th founding anniversary, the celebration is not only a remembrance of years passed, but also a tribute to moments when the campus stood firm in service of the people. One such defining moment unfolded on January 12, 2020, when Taal Volcano erupted, displacing thousands of Batangueños and altering lives in a matter of hours.</p>
          
            <p>As the Polytechnic University of the Philippines (PUP) Sto. Tomas Campus marks its 34th founding anniversary, the celebration is not only a remembrance of years passed, but also a tribute to moments when the campus stood firm in service of the people. One such defining moment unfolded on January 12, 2020, when Taal Volcano erupted, displacing thousands of Batangueños and altering lives in a matter of hours.</p>
          
            <p>As the Polytechnic University of the Philippines (PUP) Sto. Tomas Campus marks its 34th founding anniversary, the celebration is not only a remembrance of years passed, but also a tribute to moments when the campus stood firm in service of the people. One such defining moment unfolded on January 12, 2020, when Taal Volcano erupted, displacing thousands of Batangueños and altering lives in a matter of hours.</p>
          
            <p>At the heart of the campus response were its students, faculties, and staff. Almost immediately, they organized a volunteer network to assist the local government unit and manage the growing needs of the evacuees. Volunteers worked in shifting teams—receiving, sorting, and distributing donations; coordinating with external volunteer groups; and responding to urgent concerns within the evacuation center.</p>
          
            <p>Amid the efficiency and order was a quiet but powerful story of compassion. Donations poured in, mostly consisting of food, water, and clothing—basic necessities in times of disaster. Yet one simple item was overlooked: pillows. Many evacuees slept with their heads resting on bags, slippers, or the bare floor. Recognizing this, student volunteers devised a solution. Torn and unwearable clothes were collected, shredded, and stuffed into old t-shirts, which were then sewn into makeshift pillows. These handmade pillows were distributed to evacuees—small comforts that spoke volumes of care, empathy, and creativity.</p>
          
            <p>Even in crisis, the campus community understood the importance of morale. Student organizations took initiative in their own ways. The Searcher, the official student publication, diligently documented developments within the campus, keeping the public informed of the situation. Teatro Batangan, the campus drama guild, staged performances to bring laughter and relief to children affected by the disaster. Meanwhile, the Computer Society organized film showings, offering moments of escape and normalcy for evacuees enduring uncertainty. Other academic and non-acedemic organizations poured in their own efforts in easing the campus situation.</p>
          
            <p>In those challenging days of January 2020, PUP Sto. Tomas embodied the very essence of its guiding principles: “Mula sa'yo, para sa bayan” and “The Light of the Nation.” Beyond its role as an academic institution, the campus became a refuge, a service center, and a beacon of solidarity. As the campus celebrates 34 years of service, this chapter remains a powerful reminder that the true measure of an institution lies in how it stands with the people—especially in their darkest hours.</p>
          
          </div>`,
    },

  ];

  const events = [
    {
      d: 'TBA',
      m: '',
      tag: 'Yearly Event',
      image: 'assets/events/events1.jpg',
      title: 'COMSOC General Assembly 2026',
      date: 'To Be Announced',
      time: 'To Be Announced',
      location: 'PUP Sto. Tomas Gym',
      meta: [
        ['fa-location-dot', 'PUP Sto. Tomas Gym'],
        ['fa-clock', 'TBA']
      ],
      desc: `
            <div class="article-content">
              <p>The COMSOC General Assembly is the organization's flagship yearly gathering, bringing together all members of the Computer Society to kick off the academic year. It serves as the official venue for introducing the newly elected officers, presenting the organization's goals and calendar of activities, and reintroducing members to COMSOC's mission and programs.</p>
              <p>Expect an afternoon of icebreakers, orientation segments, and interactive activities designed to welcome both new and returning members into the fold. The General Assembly also sets the tone for the rest of the school year, giving members a first look at the committees, events, and opportunities they can get involved in.</p>
              <p>Further details on the exact date, time, and program flow will be announced on COMSOC's official social media pages as the event date approaches.</p>
            </div>
          `
    },

    {
      d: 'TBA',
      m: '',
      tag: 'Yearly Event',
      image: 'assets/events/events2.jpg',
      title: 'Pistang Sinta 2027',
      date: 'To Be Announced',
      time: 'To Be Announced',
      location: 'PUP Sto. Tomas Gym',
      meta: [
        ['fa-location-dot', 'PUP Sto. Tomas Gym'],
        ['fa-clock', 'TBA']
      ],
      desc: `
            <div class="article-content">
              <p>Pistang Sinta is COMSOC's annual Valentine-themed celebration, bringing a festive and colorful atmosphere to campus every February. The event features games, performances, and activities centered around friendship, love, and community — giving members a fun break from academics while strengthening camaraderie within the organization.</p>
              <p>Past editions have included booths, mini-competitions, and surprise programs prepared by the organizing committees, all designed to create a lighthearted and memorable experience for attendees.</p>
              <p>Stay tuned to COMSOC's official pages for the confirmed schedule, venue details, and program highlights for this year's edition.</p>
            </div>
          `
    },

  ];

  const achievements = [
    { num: '9+', label: 'Years Strong', title: 'Almost a Decade of Service', desc: 'Continuously serving IT students since the organization\'s founding.' },
    { num: '150+', label: 'Members Trained', title: 'Annual Skills Programs', desc: 'Members equipped through workshops, bootcamps, and mentorships each year.' },
    { num: '20+', label: 'Awards Received', title: 'Regional Recognition', desc: 'Citations from academic and technology competitions across the region.' },
    { num: '12', label: 'Tournaments Joined', title: 'Sentinel Esports Growth', desc: 'Collegiate tournaments contested by the varsity esports program.' },
  ];
  const history = {
    intro: [
      'The Bachelor of Science in Information Technology program at the Polytechnic University of the Philippines Sto. Tomas required an academic organization to represent its students, faculty, and alumni. This organization was established to ensure that the voices of its members are heard and supported, and to serve as a support system.',

      'Initially, the program was under the College of Computer Management and Information Technology (CCMIT) of the main campus in Sta. Mesa, which treated students from satellite campuses like Sto. Tomas as sub-units. At that time, college officers were based in the main campus, making it difficult for Sto. Tomas students to attend events or participate in organizational activities. To address this, local officers were elected to serve as pseudo-executives for the Sto. Tomas campus.',

      `<div class="history-seal-wrap">
              <div class="history-seal">
                <img src="assets/history/ccis.png" alt="College of Computer and Information Sciences Seal">
              </div>
            </div>`,

      'The main campus college was later renamed the College of Computer and Information Sciences (CCIS). Following this change, campus-based organizations declared full autonomy from the main campus, electing their own officers and drafting their own by-laws, while still retaining the CCIS name.',

      'In 2017, the Commission on Higher Education (CHED) required student organizations in satellite campuses to stop using the term "college", as each campus is already considered a college under the main campus. In response, the 2017 officers established a new organization, now known as the Computer Society.'
    ],
    terms: [
      {
        sy: 'SY 2017-2018',
        president: 'Aeron Eligius Bangis',
        course: 'BSIT 3-1',
        img: 'assets/history/presidents/bangis.jpg',
        events: [
          { title: '(CCIS) Year End 2017: ITrend', desc: 'The last Year-end party as the "CCIS" before transitioning to the Computer Society.' },
          { title: 'General Assembly 2017: ColorIT', desc: 'The first event as the Computer Society.' }
        ]
      },
      {
        sy: 'SY 2018-2019',
        president: 'Carlos Briggs Montealto',
        course: 'BSIT 3-1',
        events: [
          { title: 'Year End 2018: Let IT Shine', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' },
          { title: 'General Assembly 2018', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' }
        ]
      },
      {
        sy: 'SY 2019-2020',
        president: 'Jovie Melarpis',
        course: 'BSIT 3-1',
        events: [
          { title: 'Year End 2019: ITinerary', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' },
          { title: 'General Assembly 2019', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' }
        ]
      },
      {
        sy: 'SY 2020-2021',
        president: 'John Carlo Udiong',
        course: 'BSIT 3-1',
        events: [
          { title: 'General Assembly 2020: Online Games', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' }
        ]
      },
      {
        sy: 'SY 2021-2022',
        president: 'Michael John Palalimpa',
        course: 'BSIT 3-1',
        img: 'assets/history/presidents/palalimpa.jpg',
        events: [
          { title: 'General Assembly 2021: Online Games', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' }
        ]
      },
      {
        sy: 'SY 2022-2023',
        president: 'Emikhail Vincent Manalang',
        course: 'BSIT 2-1',
        img: 'assets/history/presidents/manalang.jpg',
        events: [
          { title: 'General Assembly 2023', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' }
        ]
      },
      {
        sy: 'SY 2023-2024',
        president: 'Avery Paula Guinto',
        course: 'BSIT 3-1',
        img: 'assets/history/presidents/guinto.jpg',
        events: [
          { title: 'General Assembly 2023: Online Seminar', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' }
        ]
      },
      {
        sy: 'SY 2024-2025',
        president: 'Janna Mae Macatangay',
        course: 'BSIT 3-1',
        img: 'assets/history/presidents/macatangay.jpg',
        events: [
          { title: 'General Assembly 2024: Hunger Games', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' },
          { title: 'ESports Event 2024', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' },
          { title: 'Year End 2025: ComSoc Night', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque ducimus architecto nam quod quo a! Quibusdam, facere distinctio, rem ipsam veritatis praesentium unde ducimus omnis laudantium, in a! Dolorum, consectetur.' }
        ]
      }
    ]
  };

  return { mainOfficers, advisers, committees, news, events, achievements, history };
})();