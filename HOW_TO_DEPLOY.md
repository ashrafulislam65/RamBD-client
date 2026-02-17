# cPanel Deployment Guide (Standalone Mode)

এই প্রোজেক্টটি **Next.js Standalone Mode** ব্যবহার করে Deploy করার জন্য প্রস্তুত করা হয়েছে। এটি cPanel এর মতো Shared Hosting-এ মেমোরি সমস্যা (RAM Limit) এড়াতে সাহায্য করে।

## ধাপ ১: বিল্ড (Build) তৈরি করা
আপনার লোকাল কম্পিউটারে টার্মিনাল ওপেন করুন এবং নিচের কমান্ডটি রান করুন:

```bash
npm run build
```

এটি সফলভাবে শেষ হলে `.next/standalone` নামে একটি ফোল্ডার তৈরি হবে।

## ধাপ ২: ফাইল প্রস্তুত করা (Preparation)
cPanel এ আপলোড করার জন্য একটি নতুন ফোল্ডার তৈরি করুন (যেমন: `deploy-ready`) এবং সেখানে নিচের ফাইলগুলো কপি করুন:

1. **`.next/standalone` এর ভেতরের সব ফাইল** কপি করে `deploy-ready` ফোল্ডারে পেস্ট করুন।
2. **`.next/static` ফোল্ডারটি** কপি করে `deploy-ready/.next/static` এ রাখুন।
   - *বিস্তারিত:* `deploy-ready` এর ভেতর `.next` নামে ফোল্ডার তৈরি করুন, তার ভেতর `static` ফোল্ডারটি পেস্ট করুন।
3. **`public` ফোল্ডারটি** কপি করে `deploy-ready/public` এ রাখুন।
4. **`.htaccess` ফাইলটি** আপনার প্রজেক্ট রুট থেকে কপি করে `deploy-ready/.htaccess` এ রাখুন।
5. **`ecosystem.config.js`** (যদি থাকে) অথবা `server.js` (রুট থেকে) কপি করার প্রয়োজন নেই, কারণ standalone ফোল্ডারে নিজস্ব `server.js` থাকে।

> **সংক্ষেপে আপনার আপলোড ফোল্ডারের গঠন এমন হবে:**
> - `.next/`
>   - `static/` (আপনার প্রজেক্টের .next/static থেকে আসা)
> - `public/` (আপনার প্রজেক্টের public থেকে আসা)
> - `package.json` (অটোমেটিক থাকবে)
> - `server.js` (অটোমেটিক থাকবে)
> - `.htaccess` (আপনি কপি করবেন)

## ধাপ ৩: আপলোড এবং সেটআপ (cPanel)

1. **ZIP করুন:** `deploy-ready` ফোল্ডারের সব ফাইল সিলেক্ট করে একটি `.zip` ফাইল তৈরি করুন।
2. **Upload:** cPanel এর File Manager এ গিয়ে আপনার ডোমেইন রুটে ZIP ফাইলটি আপলোড এবং Extract করুন।
3. **Node.js App তৈরি করুন:**
   - cPanel থেকে **Setup Node.js App** এ যান।
   - **Create Application** এ ক্লিক করুন।
   - **Node.js Version:** ১৮ বা তার বেশি সিলেক্ট করুন।
   - **Application Mode:** Production.
   - **Application Root:** যেখানে ফাইল এক্সট্রাক্ট করেছেন (যেমন: `public_html`).
   - **Application URL:** আপনার ডোমেইন।
   - **Application Startup File:** `server.js` লিখুন।
   - **Create** এ ক্লিক করুন।

## ধাপ ৪: ডিপ্লয় শেষ করা
1. **Node.js App** পেজে নিচের দিকে **Run NPM Install** বাটন থাকলে ক্লিক করুন (সাধারণত Standalone মোডে দরকার হয় না, তবে `sharp` বা অন্য লাইব্রেরির জন্য লাগতে পারে)।
   - *যদি `node_modules` আগে থেকেই থাকে, তাহলে এটি স্কিপ করতে পারেন।*
   - *দ্রষ্টব্য:* Standalone মোডে `npm install` ছাড়াই অ্যাপ রান হতে পারে যদি আপনি `node_modules` সহ আপলোড না করেন এবং সার্ভারে `npm install` না দেন। তবে `sharp` বা কিছু নেটিভ মডিউলের জন্য মাঝে মাঝে `npm install` লাগে। **ভালো প্র্যাকটিস হলো:** প্রথমে `npm install` ছাড়াই `Restart` দিয়ে দেখুন চলে কিনা। না চললে `Runs NPM Install` দিন।

2. **Restart** বাটনে ক্লিক করুন।
3. আপনার ডোমেইন ভিজিট করুন।

## সাধারণ সমস্যার সমাধান
- **500 Error:** `.htaccess` ফাইল আছে কিনা চেক করুন এবং লগ ফাইল (`stderr.log`) চেক করুন।
- **Image আসছে না:** `.next/static` এবং `public` ফোল্ডার ঠিকমতো আপলোড হয়েছে কিনা চেক করুন।
- **Build Fail:** লোকাল পিসিতে `npm run build` ঠিকমতো হচ্ছে কিনা নিশ্চিত করুন।
