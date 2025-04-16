// MODIFICATIONS TO UseCasesSection.tsx
// In the getUseCases function inside useEffect, update the mapping to handle arrays:

const formattedUseCases = useCasesData.map((useCase) => ({
  id: useCase.id,
  title: useCase.title,
  description: useCase.description,
  image: useCase.imageUrl,
  // Use the first element from arrays if they exist, otherwise use single values
  industry: useCase.industries && useCase.industries.length > 0 
    ? useCase.industries[0] 
    : useCase.industry,
  // Store all industries for display
  industries: useCase.industries || [useCase.industry],
  solutionType: useCase.categories && useCase.categories.length > 0 
    ? useCase.categories[0] 
    : useCase.category,
  // Store all categories for display
  categories: useCase.categories || [useCase.category],
  link: `/use-cases/${useCase.id}`,
}));

// Then, update the card rendering in the grid to display all industries and categories:
// Replace the Badge section in the Card with:

<div className="flex flex-wrap gap-1 mb-2">
  {useCase.industries && useCase.industries.map((industry, idx) => (
    <Badge
      key={`${useCase.id}-industry-${idx}`}
      variant="secondary"
      className="bg-primary/10 text-primary hover:bg-primary/20"
    >
      {industry}
    </Badge>
  ))}
  {useCase.categories && useCase.categories.map((category, idx) => (
    <Badge
      key={`${useCase.id}-category-${idx}`}
      variant="outline"
      className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-secondary/20"
    >
      {category}
    </Badge>
  ))}
</div>

// MODIFICATIONS TO UseCaseAdmin.tsx
// Update the industry and category cells in the table to display multiple values:

<td className="py-3 px-4">
  <div className="flex flex-wrap gap-1">
    {useCase.industries && useCase.industries.length > 0 ? 
      useCase.industries.map((industry, idx) => (
        <Badge 
          key={`${useCase.id}-industry-${idx}`} 
          variant="outline" 
          className="text-xs"
        >
          {industry}
        </Badge>
      )) 
      : 
      <Badge variant="outline" className="text-xs">
        {useCase.industry}
      </Badge>
    }
  </div>
</td>
<td className="py-3 px-4">
  <div className="flex flex-wrap gap-1">
    {useCase.categories && useCase.categories.length > 0 ? 
      useCase.categories.map((category, idx) => (
        <Badge 
          key={`${useCase.id}-category-${idx}`} 
          variant="secondary" 
          className="text-xs"
        >
          {category}
        </Badge>
      )) 
      : 
      <Badge variant="secondary" className="text-xs">
        {useCase.category}
      </Badge>
    }
  </div>
</td>

// MODIFICATIONS TO getUseCaseById in usecases.ts
// Make sure the return value correctly handles the industries and categories arrays:

return {
  id: data.id,
  title: data.title,
  description: data.description,
  content: data.content,
  industry: data.industry,
  category: data.category,
  // Ensure these are always arrays, even if they were stored as single values
  industries: data.industries || (data.industry ? [data.industry] : []),
  categories: data.categories || (data.category ? [data.category] : []),
  imageUrl: data.image_url,
  status: data.status,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
};
