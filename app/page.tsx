"use client";

import { useState, useEffect } from "react";
import { PayPalPayment } from "./components/PayPalPayment";
import { CryptoPayment } from "./components/CryptoPayment";
import { SolanaPayment } from "./components/SolanaPayment";
import { BitcoinPayment } from "./components/BitcoinPayment";
import { AnimatedCharacter } from "./components/AnimatedCharacter";


declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Marketplace() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string>("");
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "crypto" | "solana" | "bitcoin" | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [purchasedProducts, setPurchasedProducts] = useState<Set<string>>(new Set());
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  // Check for connected wallet and fetch purchased products
  useEffect(() => {
    checkWalletConnection();

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener?.('disconnect', handleDisconnect);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setConnectedWallet(null);
      setPurchasedProducts(new Set());
    } else {
      setConnectedWallet(accounts[0]);
      fetchPurchasedProducts(accounts[0]);
    }
  };

  const handleDisconnect = () => {
    setConnectedWallet(null);
    setPurchasedProducts(new Set());
  };

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          setConnectedWallet(accounts[0]);
          fetchPurchasedProducts(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const fetchPurchasedProducts = async (wallet: string) => {
    try {
      const response = await fetch(`/api/purchase?wallet=${wallet}`);
      const data = await response.json();
      if (data.purchases) {
        setPurchasedProducts(new Set(data.purchases));
      }
    } catch (error) {
      console.error('Error fetching purchased products:', error);
    }
  };

  const handleDownload = (productId: string) => {
    if (connectedWallet) {
      window.location.href = `/api/download?wallet=${connectedWallet}&productId=${productId}`;
    }
  };

  const products = [
    {
      id: "yellow-ghost-specter",
      name: "Yellow Ghost Specter [TEST]",
      price: 0.30,
      image: "/characters/yellow-ghost-specter.png",
      description: "🧪 TEST ITEM - 0.0001 ETH only! 8-direction animated ghost character with 14 combat animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Combat moves: punches, kicks, fireballs",
        "Special attacks: hurricane kick, flying kick",
        "Getting hit & death animations"
      ]
    },
    {
      id: "orange-ghost-specter",
      name: "Orange Ghost Specter",
      price: 5.00,
      image: "/characters/orange-ghost-specter.png",
      description: "Fiery orange ghost with full combat animation set",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Combat moves: punches, kicks, fireballs",
        "Special attacks: hurricane kick, flying kick",
        "Getting hit & death animations"
      ]
    },
    {
      id: "red-ghost-specter",
      name: "Red Ghost Specter",
      price: 5.00,
      image: "/characters/red-ghost-specter.png",
      description: "Aggressive red ghost with complete animation pack",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Combat moves: punches, kicks, fireballs",
        "Special attacks: hurricane kick, flying kick",
        "Getting hit & death animations"
      ]
    },
    {
      id: "green-ghost-specter",
      name: "Green Ghost Specter",
      price: 5.00,
      image: "/characters/green-ghost-specter.png",
      description: "Toxic green ghost with full combat animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Combat moves: punches, kicks, fireballs",
        "Special attacks: hurricane kick, flying kick",
        "Getting hit & death animations"
      ]
    },
    {
      id: "blue-ghost-specter",
      name: "Blue Ghost Specter",
      price: 5.00,
      image: "/characters/blue-ghost-specter.png",
      description: "Icy blue ghost with complete animation set",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Combat moves: punches, kicks, fireballs",
        "Special attacks: hurricane kick, flying kick",
        "Getting hit & death animations"
      ]
    },
    {
      id: "fire-elemental",
      name: "Fire Elemental",
      price: 5.00,
      image: "/characters/fire-elemental.png",
      description: "Blazing fire elemental with explosive animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Powerful fireball attacks",
        "Hurricane kick, flying kick",
        "Combat and reaction animations"
      ]
    },
    {
      id: "steam-elemental",
      name: "Steam Elemental",
      price: 5.00,
      image: "/characters/steam-elemental.png",
      description: "Mystical steam elemental with flowing animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Steam-based attacks",
        "Full combat move set",
        "Unique visual effects"
      ]
    },
    {
      id: "frost-elemental",
      name: "Frost Elemental",
      price: 5.00,
      image: "/characters/frost-elemental.png",
      description: "Frozen frost elemental with icy animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Ice-based attacks",
        "Complete combat set",
        "Freezing effects"
      ]
    },
    {
      id: "blood-elemental",
      name: "Blood Elemental",
      price: 5.00,
      image: "/characters/blood-elemental.png",
      description: "Dark blood elemental with menacing animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Blood-based attacks",
        "Full combat animations",
        "Dark visual effects"
      ]
    },
    {
      id: "acid-elemental",
      name: "Acid Elemental",
      price: 5.00,
      image: "/characters/acid-elemental.png",
      description: "Corrosive acid elemental with toxic animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Acid splash attacks",
        "Complete combat set",
        "Toxic effects"
      ]
    },
    {
      id: "ice-golem",
      name: "Ice Golem",
      price: 5.00,
      image: "/characters/ice-golem.png",
      description: "Massive ice golem with powerful animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Heavy walking & running",
        "Devastating melee attacks",
        "Ground pound abilities",
        "Boss-tier animations"
      ]
    },
    {
      id: "shadow-being",
      name: "Shadow Being",
      price: 5.00,
      image: "/characters/shadow-being.png",
      description: "Mysterious shadow entity with dark animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Ethereal movement",
        "Shadow-based attacks",
        "Stealth animations",
        "Unique visual style"
      ]
    },
    {
      id: "ghost-specter",
      name: "Ghost Specter",
      price: 5.00,
      image: "/characters/ghost-specter.png",
      description: "Classic ghost specter with full combat set",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Walking, running, idle animations",
        "Combat moves: punches, kicks, fireballs",
        "Special attacks",
        "Reaction animations"
      ]
    },
    {
      id: "skeleton-warrior",
      name: "Skeleton Warrior",
      price: 5.00,
      image: "/characters/skeleton-warrior.png",
      description: "Undead skeleton warrior with melee combat",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Armored skeleton design",
        "Sword combat animations",
        "Shield blocks & parries",
        "Bone-rattling attacks"
      ]
    },
    {
      id: "combat-robot",
      name: "Combat Robot",
      price: 5.00,
      image: "/characters/combat-robot.png",
      description: "Advanced combat robot with tech animations",
      animations: "112 total animations (14 types × 8 directions)",
      features: [
        "Mechanical movement",
        "Energy weapon attacks",
        "Jet boost abilities",
        "Sci-fi combat style"
      ]
    },
    {
      id: "alien-overlord-boss",
      name: "Alien Overlord Boss",
      price: 5.00,
      image: "/characters/alien-overlord-boss.png",
      description: "Ultimate alien boss with premium animations",
      animations: "Unique boss-tier animation set",
      features: [
        "Epic boss presence",
        "Devastating attack patterns",
        "Phase-change animations",
        "Premium quality assets"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-cyan-950 to-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-cyan-500/30">
        {/* Banner Image */}
        <div className="absolute inset-0">
          <img
            src="/banner.jpg"
            alt="FoxHole's Marketplace Banner"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/50 to-gray-900"></div>
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              FoxHole's Pixel Characters and Maps Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Premium Pixel Art Game Characters
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Pay with crypto or PayPal • Instant download • Commercial license included
            </p>
            <div className="flex justify-center gap-4 text-sm text-gray-400">
              <span>✓ 8-Direction Sprites</span>
              <span>✓ Combat Animations</span>
              <span>✓ Ready for Godot/Unity</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-cyan-400">
            Available Characters
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-500 transition-all hover:scale-105"
              >
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center p-8">
                  <AnimatedCharacter
                    characterId={product.id}
                    characterName={product.name}
                    fallbackImage={product.image}
                  />
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-3xl font-bold text-cyan-400 mb-3">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                <div className="mb-4 text-xs text-gray-500">
                  {product.animations}
                </div>

                <ul className="space-y-1 mb-6 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
</ul>                {purchasedProducts.has(product.id) ? (                  <button                    onClick={() => handleDownload(product.id)}                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold transition-all"                  >                    Download                  </button>                ) : (                  <button                    onClick={() => {                      setSelectedProduct(product.id);                      setSelectedPrice(product.price);                      setSelectedName(product.name);                      setPaymentMethod(null);                      setPaymentSuccess(false);                    }}                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 rounded-lg font-bold transition-all"                  >                    Buy Now                  </button>                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Objects Section */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-cyan-400">
            Game Objects
          </h2>
          <p className="text-center text-gray-400 mb-12">Weapons, items, and props for your game</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Placeholder Objects */}
            {[
              { name: "Pixel Pistol", description: "Animated handgun with firing effects" },
              { name: "Energy Rifle", description: "Sci-fi laser rifle with muzzle flash" },
              { name: "Shotgun", description: "Close-range scatter weapon" },
              { name: "Treasure Chest", description: "Animated opening chest with loot" },
              { name: "Health Potion", description: "Healing item with glow effect" },
              { name: "Magic Staff", description: "Wizard staff with particle effects" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 rounded-full px-3 py-1 text-xs font-bold text-green-400">
                  Coming Soon
                </div>

                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl opacity-30">🎮</div>
                </div>

                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-3xl font-bold text-gray-500 mb-3 line-through">
                  $5.00
                </p>

                <p className="text-gray-500 text-sm mb-4">{item.description}</p>

                <button
                  disabled
                  className="w-full py-3 bg-gray-700 cursor-not-allowed rounded-lg font-bold opacity-50"
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-cyan-400">
            Tileset Maps
          </h2>
          <p className="text-center text-gray-400 mb-12">Complete tilesets for building game worlds</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Placeholder Maps */}
            {[
              { name: "Dungeon Tileset", description: "Dark stone dungeon with walls, floors, and decorations", size: "16x16 tiles" },
              { name: "Forest Tileset", description: "Natural forest terrain with trees, grass, and paths", size: "16x16 tiles" },
              { name: "Sci-Fi Spaceship", description: "Futuristic interior with metal panels and tech", size: "32x32 tiles" },
              { name: "Desert Wasteland", description: "Sand dunes, rocks, and arid terrain", size: "16x16 tiles" },
              { name: "Ice Cave", description: "Frozen cavern with ice walls and crystals", size: "16x16 tiles" },
              { name: "City Streets", description: "Urban environment with roads and buildings", size: "32x32 tiles" }
            ].map((map, idx) => (
              <div
                key={idx}
                className="bg-black/40 border border-cyan-500/30 rounded-xl p-6 relative overflow-hidden"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500 rounded-full px-3 py-1 text-xs font-bold text-green-400">
                  Coming Soon
                </div>

                <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-6xl opacity-30">🗺️</div>
                </div>

                <h3 className="text-xl font-bold mb-2">{map.name}</h3>
                <p className="text-3xl font-bold text-gray-500 mb-3 line-through">
                  $10.00
                </p>

                <p className="text-gray-500 text-sm mb-2">{map.description}</p>
                <p className="text-xs text-gray-600 mb-4">Tile size: {map.size}</p>

                <button
                  disabled
                  className="w-full py-3 bg-gray-700 cursor-not-allowed rounded-lg font-bold opacity-50"
                >
                  Coming Soon
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-500 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            {paymentSuccess ? (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-green-400">Payment Successful!</h3>
                <p className="text-gray-400">
                  Thank you for your purchase of {selectedName}
                </p>
                <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                  <p className="text-sm text-gray-400 mb-2">Your purchase is complete!</p>

                  {downloadLink && (
                    <a
                      href={downloadLink}
                      download
                      className="block w-full py-3 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 rounded-lg font-bold text-center transition-all"
                    >
                      Download {selectedName}
                    </a>
                  )}

                  <p className="text-xs text-gray-500">
                    You can re-download this file anytime by connecting the same wallet and visiting this page.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setPaymentMethod(null);
                    setPaymentSuccess(false);
                  }}
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-all font-bold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-4">
                  {paymentMethod ? "Complete Payment" : "Choose Payment Method"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {selectedName} - ${selectedPrice.toFixed(2)}
                </p>

                {!paymentMethod ? (
                  <div className="space-y-4">
                    <button
                      disabled
                      className="w-full py-4 bg-gray-600 cursor-not-allowed rounded-lg font-bold transition-all flex items-center justify-center gap-2 opacity-50"
                    >
                      <span>💳</span>
                      <div className="flex flex-col items-center">
                        <span>Pay with PayPal</span>
                        <span className="text-xs text-gray-400">Coming Soon</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("crypto")}
                      className="w-full py-4 bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>🔐</span>
                      Pay with EVM Chains
                    </button>


                    <button
                      onClick={() => setPaymentMethod("solana")}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>👻</span>
                      <div className="flex flex-col items-center">
                        <span>Pay with Solana</span>
                        <span className="text-xs">SOL via Phantom</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("bitcoin")}
                      className="w-full py-4 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>₿</span>
                      <div className="flex flex-col items-center">
                        <span>Pay with Bitcoin</span>
                        <span className="text-xs">BTC Manual Payment</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        setPaymentMethod(null);
                      }}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentMethod === "paypal" ? (
                      <PayPalPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        onSuccess={() => setPaymentSuccess(true)}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : paymentMethod === "crypto" ? (
                      <CryptoPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        productId={selectedProduct || ""}
                        onSuccess={() => {
                          setPaymentSuccess(true);
                          if (typeof window !== "undefined" && window.ethereum) {
                            window.ethereum.request({ method: 'eth_accounts' })
                              .then((accounts: string[]) => {
                                if (accounts[0]) {
                                  setDownloadLink(`/api/download?wallet=${accounts[0]}&productId=${selectedProduct}`);
                                }
                              });
                          }
                        }}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : paymentMethod === "solana" ? (
                      <SolanaPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        productId={selectedProduct || ""}
                        onSuccess={() => {
                          setPaymentSuccess(true);
                          if (typeof window !== "undefined" && window.solana) {
                            setDownloadLink(`/api/download?wallet=${window.solana.publicKey.toString()}&productId=${selectedProduct}`);
                          }
                        }}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : paymentMethod === "bitcoin" ? (
                      <BitcoinPayment
                        amount={selectedPrice}
                        characterName={selectedName}
                        productId={selectedProduct || ""}
                        onSuccess={() => {
                          setPaymentSuccess(true);
                          setDownloadLink(`/api/download?wallet=bitcoin&productId=${selectedProduct}`);
                        }}
                        onError={(error) => {
                          console.error("Payment error:", error);
                          alert("Payment failed. Please try again.");
                        }}
                      />
                    ) : null}

                    <button
                      onClick={() => setPaymentMethod(null)}
                      className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
                    >
                      ← Back to Payment Methods
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black/50 border-t border-cyan-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2024 FoxHole's Pixel Characters and Maps Marketplace. All characters include commercial license.</p>
          <p className="mt-2 text-sm">Instant download • Crypto & PayPal accepted</p>
        </div>
      </footer>
    </div>
  );
}
