import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

export default function Footer({description}: {description: string}) {
    return <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        {APP_NAME}
                    </h3>
                    <p className="text-gray-400">
                        {description}
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-4">Pages</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href={'/'}>Home</Link></li>
                        <li><Link href={'/for-publishers'}>Advertisersr</Link></li>
                        <li><Link href={'/for-advertisers'}>Publishers</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 {APP_NAME}.</p>
            </div>
        </div>
    </footer>
}