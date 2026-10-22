"use client";
import {
	IconMail,
	IconPhone,
	IconMapPin,
	IconArrowRight,
	IconBrandFacebook,
	IconBrandTwitter,
	IconBrandInstagram,
	IconBrandWhatsapp,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { logoImg } from "@/public";
import React, { useState } from "react";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);

	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (email.trim()) {
			setSubscribed(true);
			setEmail("");
			setTimeout(() => setSubscribed(false), 4000);
		}
	};

	return (
		<footer className="w-full bg-[#050505] text-[#b3b3b3] pt-16 md:pt-20 relative z-999 border-t border-zinc-800/80 overflow-hidden">
			<div className="container mx-auto px-4 sm:px-6 md:px-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16 md:mb-20">
					<div className="lg:col-span-4 flex flex-col space-y-4">
						<Link
							href="/"
							className="inline-block">
							<Image
								src={logoImg}
								alt="T.Auto Logo"
								width={150}
								height={150}
								className="object-cover mb-2"
							/>
						</Link>
						<p className="text-[#888888] text-xs sm:text-sm leading-relaxed max-w-sm">
							Our services and operations are committed to GDB compliance,
							ensuring adherence to applicable regulatory requirements and
							industry standards.
						</p>

						<div className="space-y-2 pt-1 text-xs text-[#888888]">
							<a
								href="tel:07903238607"
								className="flex items-center gap-2 text-white hover:text-[#e30613] transition-colors font-medium">
								<IconPhone className="w-4 h-4 text-[#e30613] shrink-0" />
								<span>07903238607</span>
							</a>
							<a
								href="mailto:mechanics@tautos.uk"
								className="flex items-center gap-2 text-white hover:text-[#e30613] transition-colors font-medium">
								<IconMail className="w-4 h-4 text-[#e30613] shrink-0" />
								<span>mechanics@tautos.uk</span>
							</a>
							<div className="flex items-center gap-2 text-[#888888]">
								<IconMapPin className="w-4 h-4 text-[#e30613] shrink-0" />
								<span>Serving Greater London (Zones 1-6)</span>
							</div>
						</div>

						<div className="flex items-center gap-4 text-white pt-3">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
								className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-[#e30613] hover:border-[#e30613] transition-all">
								<IconBrandFacebook className="w-4 h-4" />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Twitter"
								className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-[#e30613] hover:border-[#e30613] transition-all">
								<IconBrandTwitter className="w-4 h-4" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-[#e30613] hover:border-[#e30613] transition-all">
								<IconBrandInstagram className="w-4 h-4" />
							</a>
							<a
								href="https://wa.me/447903238607"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="WhatsApp"
								className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-[#e30613] hover:border-[#e30613] transition-all">
								<IconBrandWhatsapp className="w-4 h-4" />
							</a>
						</div>
					</div>

					<div className="lg:col-span-2 flex flex-col gap-8">
						<div>
							<h4 className="text-white font-semibold mb-4 text-base tracking-wide uppercase">
								Quick Links
							</h4>
							<ul className="flex flex-col gap-2.5">
								<li>
									<FooterLink
										text="Home"
										href="/"
									/>
								</li>
								<li>
									<FooterLink
										text="Book A Service"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="Our Services"
										href="/services"
									/>
								</li>
								<li>
									<FooterLink
										text="Pricing Packages"
										href="/pricing"
									/>
								</li>
								<li>
									<FooterLink
										text="Contact Us"
										href="/contact"
									/>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-semibold mb-4 text-base tracking-wide uppercase">
								Coverage
							</h4>
							<ul className="flex flex-col gap-2.5">
								<li>
									<FooterLink
										text="London Mobile Mechanic"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="East London"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="North London"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="South London"
										href="/book-a-service"
									/>
								</li>
							</ul>
						</div>
					</div>

					<div className="lg:col-span-2 flex flex-col gap-8">
						<div>
							<h4 className="text-white font-semibold mb-4 text-base tracking-wide uppercase">
								Services
							</h4>
							<ul className="flex flex-col gap-2.5">
								<li>
									<FooterLink
										text="Full & Interim Service"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="Diagnostic Scan"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="Brake Pads & Discs"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="Battery & Coding"
										href="/book-a-service"
									/>
								</li>
								<li>
									<FooterLink
										text="Pre-MOT Inspection"
										href="/book-a-service"
									/>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-white font-semibold mb-4 text-base tracking-wide uppercase">
								Help & Legal
							</h4>
							<ul className="flex flex-col gap-2.5">
								<li>
									<FooterLink
										text="Call 07903238607"
										href="tel:07903238607"
									/>
								</li>
								<li>
									<FooterLink
										text="Privacy Policy"
										href="/privacy-policy"
									/>
								</li>
								<li>
									<FooterLink
										text="Terms & Conditions"
										href="/terms"
									/>
								</li>
								<li>
									<FooterLink
										text="3-Month Warranty"
										href="/terms#warranty"
									/>
								</li>
							</ul>
						</div>
					</div>

					<div className="lg:col-span-4 flex flex-col">
						<p className="text-white font-semibold mb-2 text-base tracking-wide uppercase">
							Stay Connected
						</p>
						<h4 className="text-xs sm:text-sm text-[#888888] mb-5 leading-relaxed">
							Subscribe to our newsletter for seasonal maintenance reminders,
							special discounts, and motoring advice.
						</h4>

						<form
							onSubmit={handleSubscribe}
							className="relative">
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								className="w-full bg-[#111113] border border-white/10 rounded-full py-3.5 pl-5 pr-14 text-white text-xs sm:text-sm focus:outline-none focus:border-[#e30613] transition-colors placeholder:text-[#666666]"
							/>
							<button
								type="submit"
								aria-label="Subscribe"
								className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-[#e30613] text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
								<IconArrowRight className="w-4 h-4" />
							</button>
						</form>

						{subscribed && (
							<p className="text-xs text-green-400 mt-2 font-medium">
								✓ Thank you for subscribing!
							</p>
						)}

						<div className="flex items-start mt-4 gap-3 cursor-pointer group">
							<div className="relative flex items-center pt-0.5">
								<input
									type="checkbox"
									id="footer-terms"
									required
									defaultChecked
									className="w-4 h-4 border border-white/20 rounded accent-[#e30613] cursor-pointer"
								/>
							</div>
							<label
								htmlFor="footer-terms"
								className="text-xs text-[#888888] group-hover:text-zinc-300 cursor-pointer transition-colors duration-300 leading-tight">
								By subscribing, you accept our{" "}
								<Link
									href="/terms"
									className="text-white hover:underline">
									terms and conditions
								</Link>
							</label>
						</div>

						<div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-[#888888]">
							<span>Mobile Call-out Zone:</span>
							<span className="text-white font-bold">Zones 1–6 London</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-white/10 text-xs text-[#888888] gap-4">
					<div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center">
						<span>
							&copy; {new Date().getFullYear()} T.Autos Mechanics LTD. All
							Rights Reserved.
						</span>
						<span className="hidden sm:inline">•</span>
						<Link
							href="/terms"
							className="hover:text-white transition-colors">
							Terms &amp; Conditions
						</Link>
						<span className="hidden sm:inline">•</span>
						<Link
							href="/privacy-policy"
							className="hover:text-white transition-colors">
							Privacy Policy
						</Link>
					</div>
					<div className="flex items-center justify-center">
						<p className="text-xs text-[#888888] font-medium">
							Designed &amp; Developed By{" "}
							<a
								target="_blank"
								rel="noopener noreferrer"
								className="text-white font-semibold hover:underline hover:text-[#e30613] transition-colors"
								href="https://hexaflowagency.co.uk/">
								HexaFlow Agency
							</a>
						</p>
					</div>
				</div>
			</div>

			<div className="w-full mt-4 pb-0 flex items-end justify-center select-none overflow-hidden leading-none px-4 pointer-events-none">
				<h1 className="text-[18vw] font-extrabold uppercase text-white/5 tracking-tighter leading-[0.8] mb-[-1%] select-none font-outfit">
					t.autos.
				</h1>
			</div>
		</footer>
	);
}

function FooterLink({ text, href }: { text: string; href: string }) {
	return (
		<Link
			href={href}
			className="text-xs sm:text-sm text-[#888888] hover:text-white transition-colors duration-300">
			{text}
		</Link>
	);
}
