"use client";

import { useState, useEffect } from "react";
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
      name: "Yellow Ghost Specter",
      price: 3.00,
      image: "/characters/yellow-ghost-specter.png",
      description: "8-direction animated ghost character with 18 combat animations",
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
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
      price: 3.00,
      image: "/characters/alien-overlord-boss.png",
      description: "Ultimate alien boss with premium animations",
      animations: "Unique boss-tier animation set",
      features: [
        "Epic boss presence",
        "Devastating attack patterns",
        "Phase-change animations",
        "Premium quality assets"
      ]
    },
    {
      id: "spider-tank-vehicle",
      name: "Tank Vehicle",
      price: 5.00,
      image: "/characters/spider-tank-vehicle.png",
      description: "Four-legged mechanical tank with cannon turret",
      vehicleSprites: "8 directional static sprites (64×64px)",
      vehicle: true,
      features: [
        "Full 8-direction coverage",
        "High detail pixel art",
        "Tank hull with cannon turret",
        "Perfect for top-down games"
      ]
    },
    {
      id: "crystal-collection",
      name: "Crystal Collection",
      price: 2,
      image: "/objects/crystal-collection.png",
      description: "Collection of 5 colorful crystal objects for your game",
      items: "5 crystal variants (blue, green, purple, red)",
      features: [
        "PNG with transparency",
        "Perfect for collectibles or power-ups",
        "Multiple color variants",
        "Ready to use in top-down games"
      ]
    },
    {
      id: "energy-barrier-collection",
      name: "Energy Barrier Collection",
      price: 2,
      image: "/objects/energy-barrier-collection.png",
      description: "Set of 4 animated-style energy barriers",
      items: "4 barrier colors (blue, green, purple, red)",
      features: [
        "PNG with transparency",
        "Perfect for gates and obstacles",
        "Multiple color variants",
        "Sci-fi themed design"
      ]
    },
    {
      id: "bridge-collection",
      name: "Bridge Collection",
      price: 2,
      image: "/objects/bridge-collection.png",
      description: "Complete bridge tileset with 16 pieces",
      items: "16 bridge pieces (4 colors × 4 sections)",
      features: [
        "Tileable bridge sections",
        "Left, middle, right tiles",
        "4 color variants",
        "Build bridges of any length"
      ]
    },
    {
      id: "toxic-vent-collection",
      name: "Toxic Vent Collection",
      price: 2,
      image: "/objects/toxic-vent-collection.png",
      description: "Set of 4 toxic vent hazards",
      items: "4 vent colors (blue, green, purple, red)",
      features: [
        "PNG with transparency",
        "Perfect for hazard zones",
        "Multiple color variants",
        "Ideal for sci-fi dungeons"
      ]
    },
    {
      id: "portal-collection",
      name: "Portal Collection",
      price: 2,
      image: "/objects/portal-collection.png",
      description: "Collection of 5 portal sprites",
      items: "5 portal colors (blue, green, purple, red, yellow)",
      features: [
        "PNG with transparency",
        "Perfect for teleportation",
        "Multiple color variants",
        "Level transitions"
      ]
    },
    {
      id: "barrier-tile-collection",
      name: "Barrier Tile Collection",
      price: 2,
      image: "/objects/barrier-tile-collection.png",
      description: "Tileable barrier set with 12 pieces",
      items: "12 barrier tiles (4 colors × 3 sections)",
      features: [
        "Tileable sections",
        "Top, middle, bottom tiles",
        "4 color variants",
        "Build vertical barriers"
      ]
    },
    {
      id: "spike-collection",
      name: "Spike Collection",
      price: 2,
      image: "/objects/spike-collection.png",
      description: "Set of 5 spike trap variations",
      items: "5 spike pieces (traps and tiles)",
      features: [
        "PNG with transparency",
        "Perfect for hazards",
        "Tileable spike sections",
        "Multiple trap sizes"
      ]
    },
    {
      id: "props-pack",
      name: "Props Pack",
      price: 2,
      image: "/objects/props-pack.png",
      description: "Essential game props pack",
      items: "4 props (artifact, boulder, crate, health orb)",
      features: [
        "PNG with transparency",
        "Collectibles and obstacles",
        "Health pickup included",
        "Storage and decoration"
      ]
    },
    {
      id: 'grass-concrete-sidewalk',
      name: 'Grass to Concrete Sidewalk',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/grass-concrete-sidewalk.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'grass-highway',
      name: 'Grass to Highway',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/grass-highway.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'dirt-cobblestone',
      name: 'Dirt to Cobblestone Path',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/dirt-cobblestone.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'grass-racing-track',
      name: 'Grass to Racing Track',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/grass-racing-track.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'grass-dirt-road',
      name: 'Grass to Dirt Road',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/grass-dirt-road.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'concrete-asphalt-road',
      name: 'Concrete to Asphalt Road',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/concrete-asphalt-road.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'cave-floor-wall',
      name: 'Cave Floor to Wall',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/cave-floor-wall.png',
      tilesetTiles: '23 tiles',
      features: [
        'Complete 23 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'grass-wooden-fence',
      name: 'Grass to Wooden Fence',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/grass-wooden-fence.png',
      tilesetTiles: '23 tiles',
      features: [
        'Complete 23 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'cobblestone-brick-wall',
      name: 'Cobblestone to Brick Wall',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/cobblestone-brick-wall.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'metal-floor-barrier',
      name: 'Metal Floor to Barrier',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/metal-floor-barrier.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'stone-dungeon-wall',
      name: 'Stone to Dungeon Wall',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/stone-dungeon-wall.png',
      tilesetTiles: '23 tiles',
      features: [
        'Complete 23 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'ocean-shallow-water',
      name: 'Ocean to Shallow Water',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/ocean-shallow-water.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'spaceship-alien-metal',
      name: 'Spaceship to Alien Metal',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/spaceship-alien-metal.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'metal-tech-blocks',
      name: 'Metal to Tech Blocks',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/metal-tech-blocks.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'ruins-alien-tech',
      name: 'Ruins to Alien Tech',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/ruins-alien-tech.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'metal-alien-tech',
      name: 'Metal to Alien Tech',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/metal-alien-tech.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'ice-walls-blocks',
      name: 'Ice Walls to Blocks',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/ice-walls-blocks.png',
      tilesetTiles: '23 tiles',
      features: [
        'Complete 23 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'volcanic-lava',
      name: 'Volcanic Rock to Lava',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/volcanic-lava.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'stone-sandstone-ruins',
      name: 'Stone to Sandstone Ruins',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/stone-sandstone-ruins.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    },
    {
      id: 'metal-tech-corridor',
      name: 'Metal to Tech Corridor',
      price: 8.00,
      description: 'Wang tileset for seamless terrain autotiling',
      image: '/tilesets/metal-tech-corridor.png',
      tilesetTiles: '16 tiles',
      features: [
        'Complete 16 tiles Wang tileset',
        'Seamless autotiling support',
        'Includes metadata JSON',
        'Ready for Godot, Unity, GameMaker',
        'Commercial license included'
      ]
    }
  ]
  // Separate characters, objects, and tilesets
  const characters = products.filter(p => p.animations);
  const objects = products.filter(p => p.items);
  const tilesets = products.filter(p => p.tilesetTiles);
  const vehicles = products.filter(p => p.vehicle);

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
              Foy Pixel Characters and Maps Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4">
              Premium Pixel Art Game Characters
            </p>
            <p className="text-lg text-gray-400 mb-8">
              Pay with crypto • Instant download • Commercial license included
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
            {characters.map((product) => (
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

      {/* Vehicles Section */}
      <section className="py-16 bg-gradient-to-b from-orange-950/30 to-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-orange-400">
            Vehicles
          </h2>
          <p className="text-center text-gray-400 mb-12">Drivable tanks and mechs for your game</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {vehicles.map((product) => (
              <div
                key={product.id}
                className="bg-black/40 border border-orange-500/30 rounded-xl p-6 hover:border-orange-500 transition-all hover:scale-105"
              >
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain pixel-art"
                  />
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-3xl font-bold text-orange-400 mb-3">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                <div className="mb-4 text-xs text-gray-500">
                  {product.vehicleSprites}
                </div>

                <ul className="space-y-1 mb-6 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {purchasedProducts.has(product.id) ? (
                  <button
                    onClick={() => handleDownload(product.id)}
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg font-bold transition-all"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setSelectedPrice(product.price);
                      setSelectedName(product.name);
                      setPaymentMethod(null);
                      setPaymentSuccess(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-lg font-bold transition-all"
                  >
                    Buy Now
                  </button>
                )}
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
            {objects.map((product) => (
              <div
                key={product.id}
                className="bg-black/40 border border-green-500/30 rounded-xl p-6 hover:border-green-500 transition-all hover:scale-105"
              >
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center p-8">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain pixel-art"
                  />
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-3xl font-bold text-green-400 mb-3">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                <div className="mb-4 text-xs text-gray-500">
                  {product.items}
                </div>

                <ul className="space-y-1 mb-6 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {purchasedProducts.has(product.id) ? (
                  <button
                    onClick={() => handleDownload(product.id)}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold transition-all"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setSelectedPrice(product.price);
                      setSelectedName(product.name);
                      setPaymentMethod(null);
                      setPaymentSuccess(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold transition-all"
                  >
                    Buy Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maps Section */}
      <section id="tilesets" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-purple-400">
            Tileset Maps
          </h2>
          <p className="text-center text-gray-400 mb-12">Complete tilesets for building game worlds</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {tilesets.map((product) => (
              <div
                key={product.id}
                className="bg-black/40 border border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all hover:scale-105"
              >
                <div className="aspect-square bg-gray-800 rounded-lg mb-4 flex items-center justify-center p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain pixel-art"
                  />
                </div>

                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-3xl font-bold text-purple-400 mb-3">
                  ${product.price.toFixed(2)}
                </p>

                <p className="text-gray-400 text-sm mb-4">{product.description}</p>

                <div className="mb-4 text-xs text-gray-500">
                  {product.tilesetTiles}
                </div>

                <ul className="space-y-1 mb-6 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-0.5">✓</span>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {purchasedProducts.has(product.id) ? (
                  <button
                    onClick={() => handleDownload(product.id)}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-bold transition-all"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProduct(product.id);
                      setSelectedPrice(product.price);
                      setSelectedName(product.name);
                      setPaymentMethod(null);
                      setPaymentSuccess(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-bold transition-all"
                  >
                    Buy Now
                  </button>
                )}
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
                    {paymentMethod === "crypto" ? (
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
          <p>© 2024 Foy Pixel Characters and Maps Marketplace. All characters include commercial license.</p>
          <p className="mt-2 text-sm">Instant download • Crypto payments only</p>
        </div>
      </footer>
    </div>
  );
}
