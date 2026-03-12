-- Insert a sample college
INSERT INTO colleges (name, code, logo_url)
VALUES ('Demo University', 'DEMO-123', 'https://ui-avatars.com/api/?name=Demo+Univ')
ON CONFLICT (code) DO NOTHING;

-- Optionally, you can insert a dummy bus for this college (we use a generic uuid for college_id, so we do it via a subquery)
INSERT INTO buses (college_id, bus_number, capacity, plate_number)
SELECT id, 'Bus-01', 50, 'XYZ-9876' 
FROM colleges WHERE code = 'DEMO-123'
LIMIT 1;
