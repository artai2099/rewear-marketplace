import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Plus, X, SlidersHorizontal, Star, MessageCircle, Home, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Listing = {
  id: number;
  title: string;
  brand: string;
  size: string;
  price: number;
  original: number;
  category: string;
  seller: string;
  rating: number;
  likes: number;
  image: string;
  color: string;
};

const seedListings: Listing[] = [
  { id: 1, title: "Classic leather tote", brand: "Madewell", size: "One Size", price: 64, original: 178, category: "Bags", seller: "Maya's Closet", rating: 4.9, likes: 82, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80", color: "Brown" },
  { id: 2, title: "Relaxed linen blazer", brand: "J.Crew", size: "M", price: 42, original: 148, category: "Women", seller: "Closet Edit", rating: 4.8, likes: 46, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80", color: "Natural" },
  { id: 3, title: "Retro court sneakers", brand: "Nike", size: "10", price: 55, original: 110, category: "Shoes", seller: "Chris Rewears", rating: 5.0, likes: 127, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", color: "Red" },
  { id: 4, title: "Vintage denim jacket", brand: "Levi's", size: "L", price: 48, original: 120, category: "Men", seller: "Second Story", rating: 4.7, likes: 69, image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=900&q=80", color: "Blue" },
  { id: 5, title: "Minimal gold watch", brand: "Fossil", size: "One Size", price: 72, original: 165, category: "Accessories", seller: "The Good Edit", rating: 4.9, likes: 54, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80", color: "Gold" },
  { id: 6, title: "Floral midi dress", brand: "Reformation", size: "S", price: 88, original: 248, category: "Women", seller: "Nora's Rack", rating: 4.9, likes: 163, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80", color: "Floral" },
];

const categories = ["All", "Women", "Men", "Shoes", "Bags", "Accessories"];

export default function ReWearMarketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("recommended");
  const [liked, setLiked] = useState<Set<number>>(new Set([3]));
  const [bag, setBag] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [sellOpen, setSellOpen] = useState(false);
  const [toast, setToast] = useState("");

  const listings = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = seedListings.filter(
      (item) =>
        (category === "All" || item.category === category) &&
        (!q || `${item.title} ${item.brand} ${item.seller}`.toLowerCase().includes(q)),
    );
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "popular") result = [...result].sort((a, b) => b.likes - a.likes);
    return result;
  }, [query, category, sort]);

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToBag = (item: Listing) => {
    if (!bag.some((x) => x.id === item.id)) setBag((prev) => [...prev, item]);
    setToast(`${item.title} added to your bag`);
    setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f7f7f4]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-8">
          <button
            className="flex items-center gap-2"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-700 text-white">
              <Tag size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">ReWear</span>
          </button>
          <div className="relative hidden flex-1 md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by item, brand, or closet"
              className="h-11 rounded-2xl border-0 bg-white pl-11 shadow-sm"
            />
          </div>
          <Button onClick={() => setSellOpen(true)} className="rounded-2xl bg-emerald-700 px-5 hover:bg-emerald-800">
            <Plus size={18} className="mr-2" />
            Sell
          </Button>
          <button className="relative rounded-2xl bg-white p-3 shadow-sm" aria-label="Shopping bag">
            <ShoppingBag size={20} />
            {bag.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {bag.length}
              </span>
            )}
          </button>
          <button className="rounded-2xl bg-white p-3 shadow-sm">
            <User size={20} />
          </button>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search ReWear"
              className="rounded-2xl border-0 bg-white pl-11"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 lg:px-8">
        <section className="grid gap-6 py-8 lg:grid-cols-[1.35fr_.65fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-emerald-800 p-8 text-white shadow-xl md:p-12">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-lime-300/20 blur-2xl" />
            <div className="relative max-w-xl">
              <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">Style, recirculated</span>
              <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                Great finds deserve another life.
              </h1>
              <p className="mt-4 max-w-lg text-lg text-emerald-50">
                Shop unique fashion from trusted closets, make offers, and turn your wardrobe into cash.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  onClick={() => document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-2xl bg-white px-6 text-emerald-900 hover:bg-emerald-50"
                >
                  Shop new drops
                </Button>
                <Button
                  onClick={() => setSellOpen(true)}
                  variant="outline"
                  className="rounded-2xl border-white/40 bg-transparent px-6 text-white hover:bg-white/10"
                >
                  List an item
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-[2rem] border-0 bg-orange-100 shadow-none">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-white">
                  <Heart size={21} />
                </div>
                <div>
                  <p className="text-3xl font-black">Fresh daily</p>
                  <p className="mt-1 text-sm text-slate-600">New listings from independent closets.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-0 bg-violet-100 shadow-none">
              <CardContent className="flex h-full flex-col justify-between p-6">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-violet-600 text-white">
                  <MessageCircle size={21} />
                </div>
                <div>
                  <p className="text-3xl font-black">Make offers</p>
                  <p className="mt-1 text-sm text-slate-600">Connect directly with sellers.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="shop">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-700">Marketplace</p>
              <h2 className="text-3xl font-black">Browse the latest</h2>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-sm">
              <SlidersHorizontal size={17} className="ml-2 text-slate-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent pr-2 text-sm font-semibold outline-none"
              >
                <option value="recommended">Recommended</option>
                <option value="popular">Most liked</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </div>
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  category === cat
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {listings.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-14 text-center">
              <Search className="mx-auto text-slate-300" size={42} />
              <h3 className="mt-4 text-xl font-bold">No matches yet</h3>
              <p className="text-slate-500">Try another keyword or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="group overflow-hidden rounded-[1.6rem] border-0 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div
                      className="relative aspect-[4/5] cursor-pointer overflow-hidden bg-slate-100"
                      onClick={() => setSelected(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        className="absolute right-3 top-3 rounded-full bg-white/90 p-2.5 shadow-sm"
                      >
                        <Heart
                          size={18}
                          className={liked.has(item.id) ? "fill-rose-500 text-rose-500" : "text-slate-700"}
                        />
                      </button>
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold">
                        {item.size}
                      </span>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.brand}</p>
                      <button
                        onClick={() => setSelected(item)}
                        className="mt-1 line-clamp-1 text-left font-bold hover:text-emerald-700"
                      >
                        {item.title}
                      </button>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <span className="text-lg font-black">${item.price}</span>
                          <span className="ml-2 text-xs text-slate-400 line-through">${item.original}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Heart size={13} />
                          {item.likes + (liked.has(item.id) ? 1 : 0)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <nav className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2 rounded-2xl bg-slate-950 p-2 text-white shadow-2xl md:hidden">
        <button className="rounded-xl bg-white/10 p-3">
          <Home size={20} />
        </button>
        <button className="p-3">
          <Search size={20} />
        </button>
        <button onClick={() => setSellOpen(true)} className="rounded-xl bg-emerald-600 p-3">
          <Plus size={20} />
        </button>
        <button className="p-3">
          <Heart size={20} />
        </button>
        <button className="p-3">
          <User size={20} />
        </button>
      </nav>

      <AnimatePresence>
        {selected && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow"
              >
                <X size={20} />
              </button>
              <img
                src={selected.image}
                alt={selected.title}
                className="h-72 w-full object-cover md:h-full"
              />
              <div className="p-7 md:p-10">
                <p className="font-bold uppercase tracking-wider text-emerald-700">{selected.brand}</p>
                <h2 className="mt-2 text-3xl font-black">{selected.title}</h2>
                <p className="mt-2 text-slate-500">
                  Size {selected.size} · {selected.color}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="text-4xl font-black">${selected.price}</span>
                  <span className="text-slate-400 line-through">${selected.original}</span>
                </div>
                <div className="my-6 rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold">Sold by {selected.seller}</p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <Star size={15} className="fill-amber-400 text-amber-400" />
                    {selected.rating} seller rating
                  </p>
                </div>
                <Button onClick={() => addToBag(selected)} className="h-12 w-full rounded-2xl bg-slate-950">
                  Add to bag
                </Button>
                <Button variant="outline" className="mt-3 h-12 w-full rounded-2xl">
                  Make an offer
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sellOpen && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4"
            onClick={() => setSellOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">New listing</p>
                  <h2 className="text-3xl font-black">Sell an item</h2>
                </div>
                <button onClick={() => setSellOpen(false)} className="rounded-full bg-slate-100 p-2">
                  <X size={20} />
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                <Input placeholder="Listing title" className="h-12 rounded-xl" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Brand" className="h-12 rounded-xl" />
                  <Input placeholder="Size" className="h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Price" className="h-12 rounded-xl" />
                  <select className="h-12 rounded-xl border px-3 text-slate-500">
                    <option>Category</option>
                    {categories.slice(1).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Describe condition, fit, and details"
                  className="min-h-28 rounded-xl border p-3 outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <Button
                  onClick={() => {
                    setSellOpen(false);
                    setToast("Draft listing saved");
                  }}
                  className="h-12 rounded-2xl bg-emerald-700"
                >
                  Save draft listing
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-[60] rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
