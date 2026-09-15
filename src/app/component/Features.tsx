
const features = [
  {
    icon: "🌿",
    title: "منتجات بجودة عالية",
    description:
      "نهتم باختيار منتجاتنا بعناية لنقدم لك جودة تليق باسم التمساح.",
  },
  {
    icon: "🍯",
    title: "طعم أصيل",
    description:
      "عسل وطحينة بطعم مميز يناسب الاستخدام اليومي والمطاعم والمحلات.",
  },
  {
    icon: "📦",
    title: "توفير للتجار",
    description:
      "عروض وأسعار خاصة للمحلات وتجار الجملة وأصحاب المطاعم.",
  },
  {
    icon: "🤝",
    title: "ثقة واستمرارية",
    description:
      "هدفنا بناء علاقات طويلة مع عملائنا من خلال الجودة والالتزام.",
  },
];

export default function Features() {
  return (
    <>
      {/* ================= FEATURES ================= */}
      <section
        id="about"
        className="bg-[#f7f4ea] px-5 py-24 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">

          {/* Section Header */}
          <div className="mx-auto mb-14 max-w-2xl text-center">

            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-[2px] w-8 bg-[#d8a84e]" />

              <span className="text-sm font-black text-[#9b7730]">
                لماذا التمساح؟
              </span>

              <span className="h-[2px] w-8 bg-[#d8a84e]" />
            </div>

            <h2 className="text-4xl font-black text-[#174c32] sm:text-5xl">
              جودة تقدر
              <span className="text-[#d09f3d]"> تثق فيها</span>
            </h2>

            <p className="mt-5 leading-8 text-gray-500">
              بنهتم بكل تفصيلة عشان نوفر لك منتجات تجمع بين
              الجودة والطعم الأصيل والسعر المناسب.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-[26px] border border-[#174c32]/10 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#174c32]/10"
              >

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7edcf] text-2xl transition duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="text-lg font-black text-[#174c32]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {feature.description}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="bg-[#fffdf7] px-5 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">

          {/* Visual */}
          <div className="relative flex min-h-[430px] items-center justify-center">

            <div className="absolute h-[330px] w-[330px] rounded-full bg-[#d8a84e]/15 blur-3xl" />

            <div className="relative flex h-[350px] w-[350px] items-center justify-center rounded-[45%] bg-[#174c32] shadow-2xl sm:h-[430px] sm:w-[430px]">

              <div className="text-center">

                <div className="text-8xl">
                  🐊
                </div>

                <h3 className="mt-5 text-4xl font-black text-white">
                  التمساح
                </h3>

                <p className="mt-3 text-sm font-bold text-[#e3b65c]">
                  جودة • أصالة • ثقة
                </p>

              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -right-3 rounded-2xl bg-white px-6 py-4 shadow-xl sm:-right-8">
                <p className="text-xs font-bold text-gray-400">
                  هدفنا
                </p>

                <p className="mt-1 text-sm font-black text-[#174c32]">
                  رضا العميل أولًا
                </p>
              </div>

            </div>
          </div>

          {/* Content */}
          <div>

            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-[#d8a84e]" />

              <span className="text-sm font-black text-[#9b7730]">
                من نحن
              </span>
            </div>

            <h2 className="text-4xl font-black leading-[1.35] text-[#174c32] sm:text-5xl">
              التمساح...
              <br />
              <span className="text-[#d09f3d]">
                طعم تعرفه وتثق فيه
              </span>
            </h2>

            <p className="mt-7 text-base leading-9 text-gray-500">
              في التمساح بنؤمن إن المنتجات الطبيعية الجيدة
              تستحق اهتمامًا خاصًا. عشان كده بنركز على تقديم
              العسل والطحينة بجودة مميزة وطعم أصيل.
            </p>

            <p className="mt-4 text-base leading-9 text-gray-500">
              وبنقدم حلول مناسبة للأفراد والمحلات وتجار الجملة
              والمطاعم، مع اهتمامنا المستمر بالجودة وخدمة العميل.
            </p>

            {/* Points */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#174c32] text-sm text-white">
                  ✓
                </span>

                <span className="font-bold text-gray-700">
                  منتجات مختارة بعناية
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#174c32] text-sm text-white">
                  ✓
                </span>

                <span className="font-bold text-gray-700">
                  عروض خاصة للتجار
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#174c32] text-sm text-white">
                  ✓
                </span>

                <span className="font-bold text-gray-700">
                  اهتمام بالجودة
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#174c32] text-sm text-white">
                  ✓
                </span>

                <span className="font-bold text-gray-700">
                  خدمة تناسب احتياجاتك
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}

