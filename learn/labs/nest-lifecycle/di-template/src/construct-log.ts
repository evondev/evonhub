// Mỗi class gọi hàm này trong constructor: in ra Nest đã truyền gì vào, và đếm số lần bị new.
export const constructCounts = new Map<string, number>();

export function logConstructed(className: string, dependencies: Record<string, unknown>) {
  const describedDependencies = Object.entries(dependencies)
    .map(([name, value]) => `${name} = ${value === undefined ? "undefined" : value?.constructor.name}`)
    .join(", ");

  constructCounts.set(className, (constructCounts.get(className) ?? 0) + 1);
  console.log(`   new ${className}(${describedDependencies})`);
}
