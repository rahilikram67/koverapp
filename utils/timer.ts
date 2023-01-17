const timer = async (seconds: number) =>
  await new Promise((resolve) => setTimeout(() => resolve(""), seconds * 1000))

export default timer
