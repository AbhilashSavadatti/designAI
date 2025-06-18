import { SimpleGrid, Card, CardHeader, CardBody, Image, Text } from '@chakra-ui/react';

export default function DesignOutput({ designs }) {
  return (
    <SimpleGrid columns={3} spacing={4}>
      {designs.map((design, index) => (
        <Card key={index}>
          <CardHeader>{design.title}</CardHeader>
          <CardBody>
            <Image src={design.image} alt={design.title} />
            <Text mt={2}>{design.summary}</Text>
            <ul>
              {design.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
}