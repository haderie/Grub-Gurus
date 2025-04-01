import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { TagData } from '../../../../types/types';
import useTagSelected from '../../../../hooks/useTagSelected';

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView = ({ t, clickTag }: TagProps) => {
  const { tag } = useTagSelected(t);

  return (
    <Box
      sx={{
        'maxWidth': 300,
        'marginBottom': 2,
        'cursor': 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
          transition: 'transform 0.3s ease',
        },
        'textAlign': 'center',
      }}
      onClick={() => {
        clickTag(t.name);
      }}>
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant='h6' fontWeight='bold' sx={{ color: '#FFA725' }} gutterBottom>
            {tag.name}
          </Typography>
          <Typography variant='body2' sx={{ color: '#6A9C89', marginBottom: 2 }}>
            {tag.description}
          </Typography>
          <Typography variant='body2' sx={{ color: '#FF6F61' }}>
            {t.qcnt} questions
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TagView;
