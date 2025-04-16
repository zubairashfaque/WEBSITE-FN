import { supabase, useLocalStorageFallback } from "../lib/supabase";

// Types for use cases
export interface UseCase {
  id: string;
  title: string;
  description: string;
  content: string;
  industry: string;
  category: string;
  industries: string[];
  categories: string[];
  imageUrl: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface UseCaseFormData {
  title: string;
  description: string;
  content: string;
  industries: string[];
  categories: string[];
  imageUrl: string;
  status: string;
}

// Local storage key for use cases
const USECASES_STORAGE_KEY = "usecases";

// Initialize local storage with empty array if not exists
const initializeLocalStorage = () => {
  if (!localStorage.getItem(USECASES_STORAGE_KEY)) {
    localStorage.setItem(USECASES_STORAGE_KEY, JSON.stringify([]));
  }
};

// Initialize on module load
initializeLocalStorage();

// Helper function to generate a slug from a title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");
};

// CRUD operations for use cases
export const getUseCases = async (): Promise<UseCase[]> => {
  try {
    const delay = Math.random() * 500 + 200; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      const useCases = JSON.parse(
        localStorage.getItem(USECASES_STORAGE_KEY) || "[]",
      ) as UseCase[];
      return useCases;
    } else {
      // Use Supabase
      const { data, error } = await supabase
        .from("usecases")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((useCase) => ({
        id: useCase.id,
        title: useCase.title,
        description: useCase.description,
        content: useCase.content,
        industry: useCase.industry,
        category: useCase.category,
        industries: useCase.industry ? [useCase.industry] : [],
        categories: useCase.category ? [useCase.category] : [],
        imageUrl: useCase.image_url,
        status: useCase.status,
        createdAt: useCase.created_at,
        updatedAt: useCase.updated_at,
      }));
    }
  } catch (error) {
    console.error("Error fetching use cases:", error);
    throw new Error("Failed to fetch use cases");
  }
};

export const getUseCaseById = async (id: string): Promise<UseCase | null> => {
  try {
    const delay = Math.random() * 300 + 100; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      const useCases = JSON.parse(
        localStorage.getItem(USECASES_STORAGE_KEY) || "[]",
      ) as UseCase[];
      return useCases.find((useCase) => useCase.id === id) || null;
    } else {
      // Use Supabase
      const { data, error } = await supabase
        .from("usecases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        content: data.content,
        industry: data.industry,
        category: data.category,
        industries: data.industry ? [data.industry] : [],
        categories: data.category ? [data.category] : [],
        imageUrl: data.image_url,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (error) {
    console.error(`Error fetching use case with ID ${id}:`, error);
    throw new Error(`Failed to fetch use case with ID ${id}`);
  }
};

export const createUseCase = async (
  data: UseCaseFormData,
): Promise<UseCase> => {
  try {
    const delay = Math.random() * 800 + 400; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Validate required fields
    if (!data.title.trim()) {
      throw new Error("Title is required");
    }

    if (!data.description.trim()) {
      throw new Error("Description is required");
    }

    if (!data.content.trim()) {
      throw new Error("Content is required");
    }

    if (!data.industries || data.industries.length === 0) {
      throw new Error("At least one industry is required");
    }

    if (!data.categories || data.categories.length === 0) {
      throw new Error("At least one category is required");
    }

    // Set default featured image if not provided
    const imageUrl =
      data.imageUrl ||
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80";

    const now = new Date().toISOString();
    const slug = generateSlug(data.title);

    if (useLocalStorageFallback()) {
      // Use localStorage
      const useCases = JSON.parse(
        localStorage.getItem(USECASES_STORAGE_KEY) || "[]",
      ) as UseCase[];

      const newUseCase: UseCase = {
        id: `usecase_${Date.now()}`,
        title: data.title,
        description: data.description,
        content: data.content,
        industries: data.industries || [],
        categories: data.categories || [],
        industry:
          data.industries && data.industries.length > 0
            ? data.industries[0]
            : "",
        category:
          data.categories && data.categories.length > 0
            ? data.categories[0]
            : "",
        imageUrl,
        status: data.status as "draft" | "published",
        createdAt: now,
        updatedAt: now,
      };

      useCases.push(newUseCase);
      localStorage.setItem(USECASES_STORAGE_KEY, JSON.stringify(useCases));

      return newUseCase;
    } else {
      // Use Supabase
      const { data: useCaseData, error } = await supabase
        .from("usecases")
        .insert({
          title: data.title,
          description: data.description,
          content: data.content,
          industry:
            data.industries && data.industries.length > 0
              ? data.industries[0]
              : "",
          category:
            data.categories && data.categories.length > 0
              ? data.categories[0]
              : "",
          image_url: imageUrl,
          status: data.status,
          created_at: now,
          updated_at: now,
        })
        .select("*")
        .single();

      if (error) {
        throw new Error(`Failed to create use case: ${error.message}`);
      }

      return {
        id: useCaseData.id,
        title: useCaseData.title,
        description: useCaseData.description,
        content: useCaseData.content,
        industry: useCaseData.industry,
        category: useCaseData.category,
        industries: useCaseData.industry ? [useCaseData.industry] : [],
        categories: useCaseData.category ? [useCaseData.category] : [],
        imageUrl: useCaseData.image_url,
        status: useCaseData.status,
        createdAt: useCaseData.created_at,
        updatedAt: useCaseData.updated_at,
      };
    }
  } catch (error) {
    console.error("Error creating use case:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create use case",
    );
  }
};

export const updateUseCase = async (
  id: string,
  data: Partial<UseCaseFormData>,
): Promise<UseCase> => {
  try {
    const delay = Math.random() * 800 + 400; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    const now = new Date().toISOString();

    if (useLocalStorageFallback()) {
      // Use localStorage
      const useCases = JSON.parse(
        localStorage.getItem(USECASES_STORAGE_KEY) || "[]",
      ) as UseCase[];
      const useCaseIndex = useCases.findIndex((useCase) => useCase.id === id);

      if (useCaseIndex === -1) {
        throw new Error(`Use case with ID ${id} not found`);
      }

      const useCase = useCases[useCaseIndex];
      const updatedUseCase: UseCase = {
        ...useCase,
        title: data.title !== undefined ? data.title : useCase.title,
        description:
          data.description !== undefined
            ? data.description
            : useCase.description,
        content: data.content !== undefined ? data.content : useCase.content,
        industries:
          data.industries !== undefined ? data.industries : useCase.industries,
        categories:
          data.categories !== undefined ? data.categories : useCase.categories,
        industry:
          data.industries !== undefined && data.industries.length > 0
            ? data.industries[0]
            : useCase.industry,
        category:
          data.categories !== undefined && data.categories.length > 0
            ? data.categories[0]
            : useCase.category,
        imageUrl:
          data.imageUrl !== undefined ? data.imageUrl : useCase.imageUrl,
        status:
          data.status !== undefined
            ? (data.status as "draft" | "published")
            : useCase.status,
        updatedAt: now,
      };

      useCases[useCaseIndex] = updatedUseCase;
      localStorage.setItem(USECASES_STORAGE_KEY, JSON.stringify(useCases));

      return updatedUseCase;
    } else {
      // Use Supabase
      const updateData: any = { updated_at: now };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.content !== undefined) updateData.content = data.content;
      if (data.industries !== undefined) {
        updateData.industry =
          data.industries.length > 0 ? data.industries[0] : "";
      }
      if (data.categories !== undefined) {
        updateData.category =
          data.categories.length > 0 ? data.categories[0] : "";
      }
      if (data.imageUrl !== undefined) updateData.image_url = data.imageUrl;
      if (data.status !== undefined) updateData.status = data.status;

      const { data: useCaseData, error } = await supabase
        .from("usecases")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        throw new Error(`Failed to update use case: ${error.message}`);
      }

      return {
        id: useCaseData.id,
        title: useCaseData.title,
        description: useCaseData.description,
        content: useCaseData.content,
        industry: useCaseData.industry,
        category: useCaseData.category,
        industries: useCaseData.industry ? [useCaseData.industry] : [],
        categories: useCaseData.category ? [useCaseData.category] : [],
        imageUrl: useCaseData.image_url,
        status: useCaseData.status,
        createdAt: useCaseData.created_at,
        updatedAt: useCaseData.updated_at,
      };
    }
  } catch (error) {
    console.error(`Error updating use case with ID ${id}:`, error);
    throw new Error(
      error instanceof Error
        ? error.message
        : `Failed to update use case with ID ${id}`,
    );
  }
};

export const deleteUseCase = async (id: string): Promise<void> => {
  try {
    const delay = Math.random() * 500 + 200; // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (useLocalStorageFallback()) {
      // Use localStorage
      const useCases = JSON.parse(
        localStorage.getItem(USECASES_STORAGE_KEY) || "[]",
      ) as UseCase[];
      const updatedUseCases = useCases.filter((useCase) => useCase.id !== id);

      if (useCases.length === updatedUseCases.length) {
        throw new Error(`Use case with ID ${id} not found`);
      }

      localStorage.setItem(
        USECASES_STORAGE_KEY,
        JSON.stringify(updatedUseCases),
      );
    } else {
      // Use Supabase
      const { error } = await supabase.from("usecases").delete().eq("id", id);

      if (error) {
        throw new Error(`Failed to delete use case: ${error.message}`);
      }
    }
  } catch (error) {
    console.error(`Error deleting use case with ID ${id}:`, error);
    throw new Error(`Failed to delete use case with ID ${id}`);
  }
};
