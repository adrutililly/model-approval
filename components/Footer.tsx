import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#d52b1e] flex items-center justify-between px-6 py-4 mt-8 relative">
      <div className="flex items-end h-12">
        <Image
          src="/lilly-logoo.png"
          alt="Lilly Logo"
          width={96}
          height={48}
          className="object-contain h-full w-auto"
        />
      </div>
      <nav className="flex items-center gap-6">
        <a href="https://lilly.service-now.com/ec?id=sc_cat_item_guide&sys_id=1c2be23e47385650acebb63a216d431d&referrer=recent_items" className="text-white font-medium hover:underline">Submit Requests and Report Issues</a>
        <a
          href="https://forms.office.com/Pages/ResponsePage.aspx?id=gZqlGKjuMEyUitiCTNwlgKEHWdfthQJKgdtZ5fv9y8FUNUo0WUo5VzNKRDhRTlFTR1FTUTBHV0JQVC4u"
          className="ml-4 px-4 py-2 rounded-full bg-[#d52b1e] text-white font-semibold border border-white hover:bg-[#b3241a] transition shadow"
        >
          Contact Us
        </a>
      </nav>
    </footer>
  );
}
