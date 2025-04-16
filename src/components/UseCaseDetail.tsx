import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { getUseCaseById } from "../api/usecases";
import Header from "./header";
import Footer from "./footer";
import ContactModal from "./ContactModal";
import "../styles/markdown.css";

interface UseCase {
  id: string;
  title: string;
  description: string;
  content: string;
  industry: string;
  category: string;
  industries?: string[];
  categories?: string[];
  imageUrl: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

const UseCaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchUseCase = async () => {
      if (!id) {
        setError("Use case ID not found");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await getUseCaseById(id);
        setUseCase(data || null);
        if (!data) {
          setError("Use case not found");
        }
      } catch (err) {
        console.error("Error fetching use case:", err);
        setError("Failed to load use case. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUseCase();
  }, [id]);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  // Simplified check for HTML content
  const isHtmlContent = (content: string): boolean => {
    if (!content) return false;
    return content.includes("</") && content.includes(">");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={handleContactClick} />

      <main className="container mx-auto px-4 py-32">
        <Button
          variant="ghost"
          className="mb-8 flex items-center gap-2"
          onClick={() => navigate("/usecases")}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Use Cases
        </Button>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error || !useCase ? (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6">
              {error || "Use case not found"}
            </h1>
            <p className="mb-8 text-gray-600">
              We couldn't find the use case you're looking for.
            </p>
            <Button onClick={() => navigate("/usecases")}>Back to Use Cases</Button>
          </div>
        ) : (
          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Handle industries - support both array and string formats */}
                {useCase.industries && Array.isArray(useCase.industries) && useCase.industries.length > 0 ? (
                  useCase.industries.map((industry, index) => (
                    <span
                      key={`industry-${index}`}
                      className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
                    >
                      {industry}
                    </span>
                  ))
                ) : typeof useCase.industry === 'string' ? (
                  <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                    {useCase.industry}
                  </span>
                ) : null}

                {/* Handle categories - support both array and string formats */}
                {useCase.categories && Array.isArray(useCase.categories) && useCase.categories.length > 0 ? (
                  useCase.categories.map((category, index) => (
                    <span
                      key={`category-${index}`}
                      className="inline-block px-3 py-1 text-sm bg-secondary/10 text-secondary rounded-full"
                    >
                      {category}
                    </span>
                  ))
                ) : typeof useCase.category === 'string' ? (
                  <span className="inline-block px-3 py-1 text-sm bg-secondary/10 text-secondary rounded-full">
                    {useCase.category}
                  </span>
                ) : null}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {useCase.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8">{useCase.description}</p>
            </div>

            {useCase.imageUrl && (
              <div className="mb-12 rounded-xl overflow-hidden">
                <img
                  src={useCase.imageUrl}
                  alt={useCase.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              {useCase.content ? (
                isHtmlContent(useCase.content) ? (
                  <div dangerouslySetInnerHTML={{ __html: useCase.content }} />
                ) : (
                  <div className="markdown-body">
                    <ReactMarkdown>{useCase.content}</ReactMarkdown>
                  </div>
                )
              ) : (
                <p>No content available</p>
              )}
            </div>

            <div className="mt-16 p-8 bg-gray-50 rounded-xl">
              <h2 className="text-2xl font-bold mb-4">
                Interested in this solution?
              </h2>
              <p className="mb-6">
                Contact us to learn more about how we can implement a similar
                solution for your business.
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={handleContactClick}
              >
                Get in Touch
              </Button>
            </div>
          </article>
        )}
      </main>

      <Footer />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
};

export default UseCaseDetail;
