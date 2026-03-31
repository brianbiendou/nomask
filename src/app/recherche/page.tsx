import { Suspense } from "react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import DynamicSidebar from "@/components/shared/DynamicSidebar";
import SearchResults from "@/components/search/SearchResults";

export default function SearchPage() {
  return (
    <div className="max-w-255 mx-auto px-4 py-6">
      <Breadcrumb items={[{ label: "Recherche" }]} />

      <h1 className="text-3xl font-black font-sans mt-4 mb-6">Recherche</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense
            fallback={
              <p className="text-gray-500 font-sans">Chargement...</p>
            }
          >
            <SearchResults />
          </Suspense>
        </div>

        <DynamicSidebar />
      </div>
    </div>
  );
}
