let internId = 0;

const nextId = () => {
  // console.log("nextId", internId);
  return internId++;
}

export default nextId
