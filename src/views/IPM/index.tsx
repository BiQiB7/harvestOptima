// IPM.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

interface Disease {
    name: string;
    imageUrl: string;
}

interface RotationCrop {
    name: string;
    imageUrl: string;
}

interface PlantInfo {
    name: string;
    imageUrl: string;
    diseases: Disease[];
    rotationCrops: RotationCrop[];
}

const plants: PlantInfo[] = [
    {
        name: 'Mung Bean',
        imageUrl: '/images/ipm/mung-bean/mung-bean.svg',
        diseases: [
            { name: 'Powdery Mildew', imageUrl: '/images/ipm/mung-bean/powdery-mildew.svg' },
            { name: 'Root Rot', imageUrl: '/images/ipm/mung-bean/root-rot.svg' },
            { name: 'Leaf Spot', imageUrl: '/images/ipm/mung-bean/leaf-spot.svg' },
        ],
        rotationCrops: [
            { name: 'Cabbage', imageUrl: '/images/ipm/mung-bean/cabbage.svg' },
            { name: 'Onion', imageUrl: '/images/ipm/mung-bean/onion.svg' },
            { name: 'Wheat', imageUrl: '/images/ipm/mung-bean/wheat.svg' },
        ],
    },
    {
        name: 'Millet',
        imageUrl: '/images/millet.jpg',
        diseases: [
            { name: 'Blast', imageUrl: '/images/millet-blast.jpg' },
            { name: 'Downy Mildew', imageUrl: '/images/millet-downy-mildew.jpg' },
            { name: 'Ergot', imageUrl: '/images/millet-ergot.jpg' },
        ],
        rotationCrops: [
            { name: 'Soybean', imageUrl: '/images/soybean.jpg' },
            { name: 'Peanut', imageUrl: '/images/peanut.jpg' },
            { name: 'Cotton', imageUrl: '/images/cotton.jpg' },
        ],
    },
];

const IPM: React.FC = () => {
    const navigate = useNavigate();

    const handleImageClick = (plantName: string, itemName: string) => {
        navigate(`/ipm/${plantName.toLowerCase().replace(' ', '-')}/${itemName.toLowerCase().replace(' ', '-')}`);
    };

    return (
        <div>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>


                <div style={{ maxWidth: '1000px', display: 'inline-block' }}>
                    <h1>Integrated Pest Management</h1>
                    {plants.map((plant) => (
                        <div key={plant.name} style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '10px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <img src={plant.imageUrl} alt={plant.name} style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '20px', borderRadius: '50%' }} />
                                {/* <h2>{plant.name}</h2> */}
                            </div>

                            <h2>Possible Diseases and Prevention</h2>
                            <p>Common diseases for {plant.name}:</p>
                            <div style={{ display: 'flex', overflowX: 'auto', marginBottom: '20px', marginTop: '20px' }}>
                                {plant.diseases.map((disease) => (
                                    <div key={disease.name} style={{ marginRight: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleImageClick(plant.name, disease.name)}>
                                        <img src={disease.imageUrl} alt={disease.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
                                        {/* <p>{disease.name}</p> */}
                                    </div>
                                ))}
                            </div>

                            <h2>Crop Rotation</h2>
                            <p>Crops that can be planted after {plant.name}:</p>
                            <div style={{ display: 'flex', overflowX: 'auto', marginTop: '20px' }}>
                                {plant.rotationCrops.map((crop) => (
                                    <div key={crop.name} style={{ marginRight: '20px', textAlign: 'center', cursor: 'pointer' }} onClick={() => handleImageClick(plant.name, crop.name)}>
                                        <img src={crop.imageUrl} alt={crop.name} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
                                        <p>{crop.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>


    );
};

export default IPM;