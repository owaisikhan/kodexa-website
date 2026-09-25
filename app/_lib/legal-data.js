// The privacy policy and the terms, as data. Written in plain words for the
// people who actually read them: a shop owner deciding whether to send their
// number, not a lawyer.
//
// Every line of the privacy policy must stay true of what the code does. Add
// analytics, a Meta pixel, a newsletter or a new place data is stored, and
// this file changes in the same commit, with `updated` moved to that day.
//
// A body item is a paragraph (string) or a bulleted list ({ list: [...] }).

import { siteConfig } from "./siteConfig.js";

const contactLine = `WhatsApp ${siteConfig.whatsappDisplay} or email ${siteConfig.email}`;

export const privacy = {
  title: "Privacy policy",
  updated: "2026-09-25",
  intro: `This page explains what ${siteConfig.name} collects when you use this website, why, and what you can ask us to do with it. The short version: we collect what you send us so we can reply, we do not sell it, and the only tracking is Meta's, to measure and show our ads on Facebook and Instagram.`,
  sections: [
    {
      id: "who",
      title: "Who we are",
      body: [
        `${siteConfig.name} is a software studio based in Pakistan. We are responsible for the information described here. You can reach us on ${contactLine}.`,
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      body: [
        "When you send a request through the form, we store:",
        {
          list: [
            "The service you picked",
            "Your business name and what you need, if you write them",
            "Your name and your WhatsApp number or email",
            "A reference number and the time the request was sent",
          ],
        },
        "When you use the chat assistant, your questions are sent to Google's Gemini service so it can write an answer. We do not save conversations to our database. A recent answer may be kept in the server's memory for up to an hour so the same question is answered faster.",
        "When you use the website speed check, the web address you type is sent to Google PageSpeed Insights to be tested. Nothing else about you is sent.",
        "Like every website, our hosting provider receives your IP address and basic browser details with each visit. We use the IP address only for a short time, to stop the forms and the assistant being flooded with automated requests.",
      ],
    },
    {
      id: "whatsapp",
      title: "WhatsApp",
      body: [
        "Sending a request opens WhatsApp with your message already written. Once you press send, that message is handled by WhatsApp under its own privacy policy, and we reply to you there. We keep the conversation only as long as we are talking to you or working on your project.",
      ],
    },
    {
      id: "browser",
      title: "Cookies and your browser",
      body: [
        "This site uses the Meta Pixel, a script from Meta (the company behind Facebook and Instagram). It tells Meta which pages you visit here, when you tap a WhatsApp button and when you send a request, and it sets Meta cookies in your browser. We use this to measure whether our ads work and to show our ads to people who have visited this site. When you send a request, the Pixel may also pass Meta your phone number or email in hashed (scrambled) form, so Meta can match the visit to a Facebook or Instagram account. Meta handles this under its own privacy policy.",
        "To limit this, change your ad preferences in your Facebook or Instagram settings, or block third-party cookies or trackers in your browser. The site works the same either way. We use no other analytics or advertising cookies.",
        "If you start the request form and leave, your answers are saved in your own browser so they are still there when you come back. They never leave your device until you press send, and they are cleared when you send the request or press Start fresh.",
        "Our team's admin area uses a sign-in cookie. It is only set for our own staff.",
      ],
    },
    {
      id: "use",
      title: "How we use it",
      body: [
        {
          list: [
            "To reply to your request with a plan and a price",
            "To build, deliver and support your project if you go ahead",
            "To keep the site working and protect it from abuse",
            "To measure our Facebook and Instagram ads, through the Meta Pixel described above",
          ],
        },
        "We do not sell your information, we do not add you to a mailing list, and we never pass your request's contents (what you need, your business) to Meta or any advertiser.",
      ],
    },
    {
      id: "share",
      title: "Who else handles it",
      body: [
        "We use a small number of services to run the site. They process data for us and only as needed to do their job:",
        {
          list: [
            "Vercel, which hosts the website",
            "Supabase, which stores the requests sent through the form",
            "Google, for the chat assistant (Gemini) and the speed check (PageSpeed Insights)",
            "WhatsApp (Meta), when you choose to send your request there",
            "Meta, through the Meta Pixel on this site",
          ],
        },
        "Some of these services store data outside Pakistan. We share information with anyone else only if the law requires it.",
      ],
    },
    {
      id: "keep",
      title: "How long we keep it",
      body: [
        "We keep a request while we are discussing it with you and, if you go ahead, for as long as we work on or support your project. After that we keep only what we need for our records. You can ask us to delete your request at any time.",
      ],
    },
    {
      id: "rights",
      title: "Your choices",
      body: [
        `You can ask us to show you what we hold about you, correct it, or delete it. Message us on ${contactLine} and we will do it within 30 days, usually much sooner.`,
      ],
    },
    {
      id: "children",
      title: "Children",
      body: ["This site is for businesses and is not meant for children under 13. We do not knowingly collect their information."],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      body: ["If we change how we handle your information, we will update this page and the date at the top."],
    },
  ],
};

export const terms = {
  title: "Terms of service",
  updated: "2026-09-24",
  intro: `These terms cover using this website and working with ${siteConfig.name}. Your project's quote sets out the specific work, price, timeline and payment schedule. If the quote and these terms disagree, the quote wins.`,
  sections: [
    {
      id: "site",
      title: "Using this website",
      body: [
        "You can browse this site, use the service finder, the speed check and the chat assistant, and send us requests. Please do not try to break or overload it, or send requests in someone else's name.",
        "The chat assistant answers questions about our services. It can make mistakes, and it cannot agree prices or deadlines. Only a written quote from us does that.",
      ],
    },
    {
      id: "requests",
      title: "Requests and quotes",
      body: [
        "Sending a request is free and does not commit you to anything. We reply with a written plan and a fixed price for the work described.",
        "A quote says what will be built, the price, the timeline and when payments are due. It is valid for 30 days unless it says otherwise. The project starts when you accept it.",
      ],
    },
    {
      id: "scope",
      title: "Changes to the work",
      body: [
        "The fixed price covers the work in the quote. If you ask for something new while we build, we tell you whether it changes the price or the timeline before we do it, and nothing extra is charged without your approval.",
      ],
    },
    {
      id: "payment",
      title: "Payments",
      body: [
        "You pay according to the schedule in your quote. Work on a stage may pause while a payment for it is overdue, and the timeline moves by the same amount.",
        "If you cancel a project, you pay for the work done up to that point, as set out in the quote, and we hand over that work to you.",
      ],
    },
    {
      id: "yours",
      title: "Your part",
      body: [
        "Some things only you can give us: your content (text, photos, logos, prices), access to accounts we need to set up, and feedback when we send you the working link. Delays in these move the timeline too.",
        "You confirm that you have the right to use everything you send us, and that the business the project is for is lawful.",
      ],
    },
    {
      id: "ownership",
      title: "Who owns what",
      body: [
        "Once the project is paid for, you own the code we wrote for it, and the domain, hosting, database and accounts are in your name.",
        "Open-source tools and libraries in your project stay under their own licences, which allow you to use them. We may reuse our general know-how and building blocks in other projects, but never your content, your data or anything specific to your business.",
        "We may mention that we built your project, for example on our Work page, unless you ask us not to. We never publish your data, customers or figures.",
      ],
    },
    {
      id: "after",
      title: "After launch",
      body: [
        "If something we built does not work as the quote describes, tell us and we will fix it. New features, changes of mind and problems caused by later changes made by someone else are quoted separately, or covered by a monthly maintenance plan if you have one.",
        "Services we do not control, such as hosting providers, payment gateways, app stores and WhatsApp, run under their own terms and can change without notice.",
      ],
    },
    {
      id: "liability",
      title: "Limits",
      body: [
        "We build with care and test before we launch, but no software is free of faults. Our total responsibility for a project is limited to the amount you paid us for it, and we are not responsible for indirect losses such as lost profit or lost data. Nothing here limits anything the law does not allow us to limit.",
      ],
    },
    {
      id: "law",
      title: "Law and disputes",
      body: [
        "These terms are governed by the laws of Pakistan. If something goes wrong, talk to us first: most problems are solved with a message. If not, the courts of Pakistan decide.",
      ],
    },
    {
      id: "contact",
      title: "Questions",
      body: [`Ask us anything about these terms on ${contactLine}.`],
    },
  ],
};
