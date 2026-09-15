
"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // رقم واتساب البراند
    // اكتب الرقم بدون + أو مسافات
    const whatsappNumber = "201278389339";

    const whatsappMessage = `
مرحبًا التمساح 👋

الاسم: ${name}
رقم الهاتف: ${phone}
نوع العميل: ${type || "غير محدد"}

الرسالة:
${message}
    `.trim();

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="rounded-[30px] border border-[#174c32]/10 bg-white p-6 shadow-xl shadow-[#174c32]/5 sm:p-8">

      {/* Header */}
      <div className="mb-7">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e9f2ec] text-lg">
            💬
          </span>

          <span className="text-sm font-black text-[#9b7730]">
            تواصل معنا
          </span>
        </div>

        <h3 className="text-2xl font-black text-[#174c32] sm:text-3xl">
          عندك استفسار؟
        </h3>

        <p className="mt-2 text-sm leading-7 text-gray-500">
          املأ البيانات وسيتم فتح واتساب برسالتك مباشرة.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Name + Phone */}
        <div className="grid gap-5 sm:grid-cols-2">

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              الاسم
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك"
              required
              className="w-full rounded-2xl border border-gray-200 bg-[#fafaf8] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#174c32] focus:bg-white focus:ring-4 focus:ring-[#174c32]/5"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              رقم الهاتف
            </label>

            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              required
              dir="ltr"
              className="w-full rounded-2xl border border-gray-200 bg-[#fafaf8] px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#174c32] focus:bg-white focus:ring-4 focus:ring-[#174c32]/5"
            />
          </div>

        </div>

        {/* Customer Type */}
        <div>
          <label
            htmlFor="type"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            نوع العميل
          </label>

          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-gray-200 bg-[#fafaf8] px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-[#174c32] focus:bg-white focus:ring-4 focus:ring-[#174c32]/5"
          >
            <option value="">اختر نوع العميل</option>
            <option value="عميل فردي">عميل فردي</option>
            <option value="محل">محل</option>
            <option value="تاجر جملة">تاجر جملة</option>
            <option value="مطعم">مطعم</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            رسالتك
          </label>

          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب استفسارك أو المنتجات التي تريد معرفة أسعارها..."
            required
            rows={5}
            className="w-full resize-none rounded-2xl border border-gray-200 bg-[#fafaf8] px-4 py-3.5 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#174c32] focus:bg-white focus:ring-4 focus:ring-[#174c32]/5"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#174c32] px-6 py-4 font-black text-white shadow-lg shadow-[#174c32]/15 transition duration-300 hover:-translate-y-1 hover:bg-[#103b27]"
        >
          <span className="text-xl">
            💬
          </span>

          إرسال عبر واتساب

          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
        </button>

        <p className="text-center text-xs text-gray-400">
          سيتم تحويلك إلى واتساب لإرسال الرسالة
        </p>

      </form>
    </div>
  );
}

